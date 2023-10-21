import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

import { logicAddress, logicAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
console.log("el signer es:" + await signer.getAddress());
document.getElementById('userAddr').value = await signer.getAddress();
const logic = new ethers.Contract(logicAddress, logicAbi, signer);

const registerRequestButton = document.getElementById('registerRequestButton')

registerRequestButton.addEventListener('click', async(e) => {
    e.preventDefault();
    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    var userAddr = document.getElementById('userAddr').value;
    var role = document.getElementById("roles").value;

    console.log(userAddr);
    console.log(role);


    try {
        const tx = await logic.createRegisterRequest(userAddr, role, signer.getAddress());
        const receipt = await tx.wait();

        if (receipt) {
            document.querySelector(".show").style.display = "flex";

            Swal.fire({
                title: '<strong>Solicitud de registro enviada!</strong>',
                icon: 'success',
                allowOutsideClick: false,
                html: 'La solicitud será revisada por un usuario administrador',
                showCloseButton: true,
                showCancelButton: false,
                closeOnCancel: true,
                focusConfirm: false,
                confirmButtonText: '<a href="/" style="color: #fff">Inicio</a>',
                confirmButtonTextColor: '#fff',
                confirmButtonColor: '#F22E76',
            })


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal!',
                footer: 'Intenta realizar la solicitud nuevamente'
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
        });
    }

    // Request account access if needed
    await ethereum.enable();

});