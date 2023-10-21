import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, logicAbi } from "../javascripts/contractData.js"
import { checkChain } from "./checkChain.js";
// Create global userWalletAddress variable
window.userWalletAddress = null;
const wallet = window.localStorage.getItem("userWalletAddress");
// when the browser is ready
window.onload = async(event) => {
    // check if ethereum extension is installed
    if (window.ethereum) {
        // create web3 instance
        window.web3 = new Web3(window.ethereum);
    } else {
        // prompt user to install Metamask
        alert("Please install MetaMask or any Ethereum Extension Wallet");
    }
    if (wallet) {
        // Set logout button
        document.querySelector(".logout-nav").style.display = "flex";
    }

    // check if user is already logged in and update the global userWalletAddress variable
    window.userWalletAddress = window.localStorage.getItem("userWalletAddress");

    // show the user dashboard
    showUserDashboard();
};

// Web3 login function
const loginWithEth = async() => {
    // check if there is global window.web3 instance
    if (wallet) {
        return
    }
    if (window.web3) {
        checkChain()
        try {
            // get the user's ethereum account - prompts metamask to login
            window.localStorage.setItem("userWalletAddress", null);
            window.userWalletAddress = null
            await window.ethereum
                .request({
                    method: "eth_requestAccounts",
                })
                .then(async(accounts) => {
                    window.userWalletAddress = accounts[0]
                        // store the user's wallet address in local storage
                    window.localStorage.setItem("userWalletAddress", accounts[0]);
                    // post login to express session
                    const roll = await checkUserRoll(accounts[0]);
                    if (roll) {
                        handlePostLogin(accounts[0], roll);
                    } else {
                        // alert('user not autorized in this app');
                        Swal.fire({
                            title: '<strong>Acceso Denegado</strong>',
                            icon: 'question',
                            html: '¿Aún no estás registrado?',
                            showCloseButton: false,
                            showCancelButton: false,
                            focusConfirm: false,
                            allowOutsideClick: true,
                            confirmButtonText: `<a href="/registerRequest" style="color:#fff">Realizar Solicitud de Registro</a>`
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                        // if the user cancels the login prompt
                    throw Error("Please select an account on Polygon Network");
                });

            // show the user dashboard
            showUserDashboard();
        } catch (error) {
            alert(error);
        }
    } else {
        alert("wallet not found");
    }
};

const handlePostLogin = async(addr, roll) => {
    const rawResponse = await fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addr: addr, roll: roll })
    });
    const content = await rawResponse.json();
    if (content.roll) {
        window.location.replace("/projects")
    } else {
        window.location.replace("/")
    }
    return content
}

const handlePostLogout = async(addr) => {
    const rawResponse = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const content = await rawResponse.json();
    console.log(content)
    window.location.replace("/")
    return content
}


// function to show the user dashboard
const showUserDashboard = async() => {
    // if the user is not logged in - userWalletAddress is null
    if (!window.userWalletAddress) {
        document.querySelector(".wallet-img").style.display = "flex";
        const wallettitleEl = document.querySelector(".wallet-dialog");
        wallettitleEl.innerHTML = 'Login With Metamask'
            // return from the function
        return false;
    }

    // change the page title
    document.title = "Web3 Dashboard  🤝";

    showUserWalletAddress();
    //window.location.replace("/projects");   


    getWalletBalance();
};

// show the user's wallet address from the global userWalletAddress variable
const showUserWalletAddress = () => {
    document.querySelector(".wallet-img").style.display = "none";
    const walletDialogEl = document.querySelector(".wallet-dialog");
    const addr = window.localStorage.getItem("userWalletAddress")
    walletDialogEl.innerHTML = addr.slice(0, 5) + '...' + addr.substring(addr.length - 5)
};

// get the user's wallet balance
const getWalletBalance = async() => {
    // check if there is global userWalletAddress variable
    if (!window.userWalletAddress) {
        return false;
    }

    // get the user's wallet balance
    const balance = await window.web3.eth.getBalance(window.userWalletAddress);

    // convert the balance to ether
    /* document.querySelector(".wallet-balance").innerHTML = web3.utils.fromWei(
      balance,
      "ether"
    ); */
};

const checkUserRoll = async(account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const logic = new ethers.Contract(logicAddress, logicAbi, signer);
    const superAdminRoleHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const adminRoleHash = '0x16aa3b742078015316c8244ff5f4dc4ad56113a676883471968e2db28b015503';
    const makerRoleHash = '0x4c79f72f8346da4d239c2e437bddae474a1e47c4f796c16849f58aa1145444ba';
    const reviewerRoleHash = '0xbfbffa1a8878d68b4e692b38304c07c82f7b7f21636e8a0631c39d9919b9cc9a';
    const approverRoleHash = '0x5f177cb822c03126f37dfc2fc4ac0fc5e363900f0b49d3b25be74dd08011fff9';
    const autorizedAsSuperAdmin = await logic.hasRole(superAdminRoleHash, account);
    const autorizedAsAdmin = await logic.hasRole(adminRoleHash, account);
    const autorizedAsMaker = await logic.hasRole(makerRoleHash, account);
    const autorizedAsReviewer = await logic.hasRole(reviewerRoleHash, account);
    const autorizedAsApprover = await logic.hasRole(approverRoleHash, account);

    if (autorizedAsSuperAdmin == true) {
        return 'superAdmin'
    }
    if (autorizedAsAdmin == true) {
        return 'admin'
    }
    if (autorizedAsMaker == true) {
        return 'maker'
    }
    if (autorizedAsReviewer == true) {
        return 'reviewer'
    }
    if (autorizedAsApprover == true) {
        return 'approver'
    }
}

// web3 logout function
const logout = () => {
    // set the global userWalletAddress variable to null
    window.userWalletAddress = null;

    // remove the user's wallet address from local storage
    window.localStorage.removeItem("userWalletAddress");

    handlePostLogout()

    // show the user dashboard
    showUserDashboard();
};

// when the user clicks the login button run the loginWithEth function
document.querySelector(".login-btn").addEventListener("click", loginWithEth);

// when the user clicks the logout button run the logout function
const elements = document.querySelectorAll(".logout-btn")
elements.forEach((userItem) => {
    userItem.addEventListener("click", logout);
});