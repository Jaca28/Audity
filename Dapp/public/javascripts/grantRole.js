import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

import { logicAddress, logicAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const logic = new ethers.Contract(logicAddress, logicAbi, signer);

const grantRoleButton = document.getElementById('grantRoleButton')
const urlParams = new URLSearchParams(window.location.search);
const roleUrl = urlParams.get('role');
const userUrl = urlParams.get('user');
const valueUrl = urlParams.get('value');

var userAddr = document.getElementById('userAddr');
var role = document.getElementById("roles");
var hashRole;

if(valueUrl == 2){
    userAddr.value = userUrl;
    role.value =  roleUrl;
}

grantRoleButton.addEventListener('click', async(e) => {
    e.preventDefault();
    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    var userAddr = document.getElementById('userAddr').value;
    var role = document.getElementById("roles").value;

    console.log(userAddr);
    console.log(role);

    if (role == 'sAdmin') {
        hashRole = '0x0000000000000000000000000000000000000000000000000000000000000000';

    } else if (role == 'admin') {
        hashRole = '0x16aa3b742078015316c8244ff5f4dc4ad56113a676883471968e2db28b015503';

    } else if (role == 'maker') {
        hashRole = '0x4c79f72f8346da4d239c2e437bddae474a1e47c4f796c16849f58aa1145444ba';

    } else if (role == 'reviewer') {
        hashRole = '0xbfbffa1a8878d68b4e692b38304c07c82f7b7f21636e8a0631c39d9919b9cc9a';

    } else if (role == 'approver') {
        hashRole = '0x5f177cb822c03126f37dfc2fc4ac0fc5e363900f0b49d3b25be74dd08011fff9';
    }
    try {
        const tx = await logic.grantRole(hashRole, userAddr, signer.getAddress());
        const receipt = await tx.wait();

        if (receipt) {
            document.querySelector(".show").style.display = "flex";
            if (role == 'maker' || role == 'reviewer' || role == 'approver') {
                Swal.fire({
                    title: '<strong>Rol Otorgado!</strong>',
                    icon: 'success',
                    html: 'La dirección pública: ' + userAddr + ' ahora posee el rol ' + role,
                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    allowOutsideClick: false,
                    confirmButtonText: `
                        <a href="/setUser?role=${role}&user=${userAddr}" style="color: #fff">
                    Configurar Usuario
                    </a>`,
                })
            } else {
                Swal.fire(
                    'Rol Otorgado!',
                    'La dirección pública: ' + userAddr + ' ahora posee el rol ' + role,
                    'success'
                );
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal!',
                footer: 'Intenta realizar la transacción nuevamente'
            });
        }
        document.querySelector(".cover-spin").style.display = "none";
        document.querySelector(".show").style.display = "block";
    } catch (error) {
        document.querySelector(".cover-spin").style.display = "none";
        document.querySelector(".show").style.display = "block";
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.reason,
            footer: '<a href="">Why do I have this issue?</a>'
        });
    }

    // Request account access if needed
    // await ethereum.enable();

});