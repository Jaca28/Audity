import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

import { logicAddress, logicAbi } from "../javascripts/contractData.js";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const signer = provider.getSigner();

const logic = new ethers.Contract(logicAddress, logicAbi, signer);

const setUserButton = document.getElementById('setUserButton')

const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role');
const user = urlParams.get('user');
const userAddrInput = document.getElementById('userAddr');
const roleSelect = document.getElementById("roles");
userAddrInput.value = user
roleSelect.value = role

setUserButton.addEventListener('click', async(e) => {
    e.preventDefault();

    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    var projectId = document.getElementById("projects").value;
    var requirementId = document.getElementById("requirements").value;

    console.log(userAddr);
    console.log(role);
    console.log(projectId);
    console.log(requirementId);


    if (role == 'maker') {
        try {
            const tx = await logic.setMaker(projectId, requirementId, userAddrInput.value, signer.getAddress());
            const receipt = await tx.wait();

            if (receipt) {
                Swal.fire(
                    'Usuario Maker Configurado!',
                    'La dirección pública: ' + user + ' ahora es usuario Maker',
                    'success'
                );

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal!',
                    footer: 'Intenta realizar la transacción nuevamente'
                });
            }
        } catch (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.reason
            });
        }
        document.querySelector(".cover-spin").style.display = "none";
        document.querySelector(".show").style.display = "block";

        // Request account access if needed
        await ethereum.enable();

    } else if (role == 'reviewer') {

        try {
            const tx = await logic.setReviewer(projectId, requirementId, userAddrInput.value, signer.getAddress());
            const receipt = await tx.wait();

            if (receipt) {
                Swal.fire(
                    'Usuario Reviewer Configurado!',
                    'La dirección pública: ' + user + ' ahora es usuario Reviewer',
                    'success'
                );

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal!',
                    footer: 'Intenta realizar la transacción nuevamente'
                });
            }
        } catch (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
        }
        document.querySelector(".cover-spin").style.display = "none";
        document.querySelector(".show").style.display = "block";
        // Request account access if needed
        await ethereum.enable();

    } else if (role == 'approver') {

        try {
            const tx = await logic.setApprover(projectId, requirementId, userAddrInput.value, signer.getAddress());

            const receipt = await tx.wait();

            if (receipt) {

                Swal.fire(
                    'Usuario Approver Configurado!',
                    'La dirección pública: ' + user + ', ahora es usuario Approver',
                    'success'
                );

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal!',
                    footer: 'Intenta realizar la transacción nuevamente'
                });
            }
        } catch (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
        }

        document.querySelector(".cover-spin").style.display = "none";
        document.querySelector(".show").style.display = "block";
        // Request account access if needed
        await ethereum.enable();

    }

});