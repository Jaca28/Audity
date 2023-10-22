import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

import { logicAddress, logicAbi } from "../javascripts/contractData.js";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
const assignStateButton = document.getElementById('assignStateReqButton');

// console.log('el roll ' + roll);

assignStateButton.addEventListener('click', async(e) => {
    e.preventDefault();

    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    var projectId = parseInt(document.getElementById('projects').value);
    var requirementId = parseInt(document.getElementById('requirements').value);
    var lastHash = document.getElementById("file_hash").innerHTML;
    var state = '';

    console.log(projectId);
    console.log(requirementId);
    console.log(lastHash);

    try {
        let tx
        let receipt
        const select = document.getElementById("selectReqState")

        if (select.value === "Created") {
            tx = await logic.setMadeRequirement(projectId, requirementId, lastHash, signer.getAddress());
            receipt = await tx.wait();
            state = 'created';
        }
        if (select.value === "Approved") {
            tx = await logic.setApprovedRequirement(projectId, requirementId, lastHash, signer.getAddress());
            receipt = await tx.wait();
            state = 'approved';
        }
        if (select.value === "Reviewed") {
            tx = await logic.setReviewedRequirement(projectId, requirementId, lastHash, signer.getAddress());
            receipt = await tx.wait();
            state = 'reviewed';
        }
        if (receipt) {
            Swal.fire(
                'Hash stored!',
                'The requirement has been labeled as ' + state,
                'success'
            );

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: ' Something went wrong!',
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