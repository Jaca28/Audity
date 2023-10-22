import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, dataAddress, logicAbi, dataAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner()
const data = new ethers.Contract(dataAddress, dataAbi, signer);
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
let accounts = await window.ethereum.request({ method: 'eth_accounts' });
var projectId;
const createRequirementButton = document.getElementById('createRequirementButton')

createRequirementButton.addEventListener('click', async(e) => {
    e.preventDefault();

    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    var projectId = (parseInt(document.getElementById('projects').value));
    var projectRequirementName = document.getElementById('projectRequirementName').value;
    console.log(projectId);
    console.log(projectRequirementName);


    try {
        const tx = await logic.setProjectRequirement(projectId, projectRequirementName, signer.getAddress());
        const receipt = await tx.wait();

        if (receipt) {
            Swal.fire(
                'Project requirement created!',
                'The requirement is now upgradeable',
                'success'
            );

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: 'Try transaction again'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.reason,
        });
    }
    document.querySelector(".cover-spin").style.display = "none";
    document.querySelector(".show").style.display = "block";

    // Request account access if needed
    await ethereum.enable();
});