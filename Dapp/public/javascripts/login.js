import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const onboardButton = document.getElementById('connectButton');
// Check if MetaMask is installed on user's browser

const onClickConnect = async() => {
    try {
        const newAccounts = await ethereum.request({
            method: 'eth_requestAccounts',

        });
        console.log('Se conectó Metamask...')
        onboardButton.innerHTML = 'connected';
        onboardButton.disabled = true;
    } catch (error) {
        console.error(error);
    }
};

if (window.ethereum) {
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    console.log('Metamask is Installed!');
    console.log(accounts);
    console.log(chainId);

} else {
    // Show alert if Ethereum provider is not detected
    console.log('Metamask is not Installed!')
    alert("Please install Mask");
}

let accounts = await window.ethereum.request({ method: 'eth_accounts' });

if (window.ethereum && accounts != '') {
    console.log('Metamask is connected!')
    onboardButton.innerHTML = 'connected';
    onboardButton.disabled = true;
    data_query_swal();

    function data_query_swal() {
        Swal.fire({
            title: 'Connectinb...',
            text: 'We are querying the contract data on the Blockchain.',
            showConfirmButton: false
        })
    }

    const signer = provider.getSigner();

    console.log("La dirección pública del data es:" + dataAddress);
    console.log("La dirección pública del logic es:" + logicAddress);


    const data = new ethers.Contract(dataAddress, dataAbi, signer);

    const logic = new ethers.Contract(logicAddress, logicAbi, signer);

    const superAdminRoleHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

    const adminRoleHash = '0x16aa3b742078015316c8244ff5f4dc4ad56113a676883471968e2db28b015503';

    const makerRoleHash = '0x4c79f72f8346da4d239c2e437bddae474a1e47c4f796c16849f58aa1145444ba';

    const reviewerRoleHash = '0xbfbffa1a8878d68b4e692b38304c07c82f7b7f21636e8a0631c39d9919b9cc9a';

    const approverRoleHash = '0x5f177cb822c03126f37dfc2fc4ac0fc5e363900f0b49d3b25be74dd08011fff9';

    var autorizedAsSuperAdmin = await logic.hasRole(superAdminRoleHash, accounts[0]);
    var autorizedAsAdmin = await logic.hasRole(adminRoleHash, accounts[0]);
    var autorizedAsMaker = await logic.hasRole(makerRoleHash, accounts[0]);
    var autorizedAsReviewer = await logic.hasRole(reviewerRoleHash, accounts[0]);
    var autorizedAsApprover = await logic.hasRole(approverRoleHash, accounts[0]);

    if (autorizedAsSuperAdmin == true) {
        Swal.close();
        document.getElementById('publicKey').innerHTML = accounts[0];
        document.getElementById('publicKey').style.display = "block";
        console.log("You are a superAdmin")
    } else if (autorizedAsAdmin == true) {
        Swal.close();
        document.getElementById('publicKey').innerHTML = accounts[0];
        document.getElementById('publicKey').style.display = "block";
        console.log("You are an Admin")
    } else if (autorizedAsMaker == true) {
        Swal.close();
        document.getElementById('publicKey').innerHTML = accounts[0];
        document.getElementById('publicKey').style.display = "block";
        console.log("You are a Maker")
    } else if (autorizedAsReviewer == true) {
        Swal.close();
        document.getElementById('publicKey').innerHTML = accounts[0];
        document.getElementById('publicKey').style.display = "block";
        console.log("You are a Reviewer")
    } else if (autorizedAsApprover == true) {
        Swal.close();
        document.getElementById('publicKey').innerHTML = accounts[0];
        document.getElementById('publicKey').style.display = "block";
        console.log("You are a Approver")
    } else {
        Swal.close();
        Swal.fire({
            title: 'Denied Access',
            text: 'Your public address is not authorized for access, consult your administrator.',
            showConfirmButton: false
        })

        // Swal.fire({
        //     title: '<strong>Acceso Denegado</strong>',
        //     icon: 'question',
        //     html: '¿Aún no estás registrado?',
        //     showCloseButton: false,
        //     showCancelButton: false,
        //     focusConfirm: false,
        //     allowOutsideClick: true,
        //     confirmButtonText: `
        //         <a href="/registerRequest>
        //     Realizar Solicitud de Registro
        //     </a>`,
        // })
    }

} else {
    onboardButton.onclick = onClickConnect;
    console.log('Metamask is not connected')
    document.getElementById('connectButton').style.display = 'block';

}

// event triggered when metamask is disconnected from chain and can not make rpc request
ethereum.on('disconnect', () => {
    onboardButton.innerHTML = 'Metamask Connection';
    onboardButton.disabled = false;
    alert('Metamask is not connected to ethereum network. Retry!')
})