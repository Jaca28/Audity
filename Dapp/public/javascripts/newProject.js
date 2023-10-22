import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, logicAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
const createProjectButton = document.getElementById('createProjectButton')

createProjectButton.addEventListener('click', async(e) => {
    e.preventDefault();
    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    const projectName = document.getElementById('projectName').value;
    const projectAdminAddr = document.getElementById('projectAdminAddr').value;
    const projectRequirements = document.getElementById('projectRequirements').value;

    try {
        const tx = await logic.createProject(projectName, projectAdminAddr, projectRequirements, signer.getAddress());
        const receipt = await tx.wait();

        if (receipt) {
            document.querySelector(".show").style.display = "block";

            Swal.fire({
                title: '<strong>Project Created!</strong>',
                icon: 'success',
                allowOutsideClick: false,
                html: 'You can now configure your project requirements',
                showCloseButton: false,
                showCancelButton: false,
                closeOnCancel: true,
                focusConfirm: false,
                confirmButtonText: '<a href="/newRequirement" style="color:#fff;border-radius: 10rem;">Configure</a> ',
                confirmButtonColor: '#F22E76',
            })

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: 'Try the transaction again'
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