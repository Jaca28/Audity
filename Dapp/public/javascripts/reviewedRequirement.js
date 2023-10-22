import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

import { logicAddress, logicAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
const signer = provider.getSigner()
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
const assignStateButton = document.getElementById('reviewedReqButton')

assignStateButton.addEventListener('click', async(e) => {
    e.preventDefault();

    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "flex";

    var projectId = parseInt(document.getElementById('projects').value);
    var requirementId = parseInt(document.getElementById('requirements').value);
    var lastHash = document.getElementById("file_hash").innerHTML;

    console.log(projectId);
    console.log(requirementId);
    console.log(lastHash);

    try {
        let tx
        let receipt

        tx = await logic.setReviewedRequirement(projectId, requirementId, lastHash, signer.getAddress());
        receipt = await tx.wait();

        if (receipt) {
            Swal.fire(
                'Hash stored!',
                'The requirement has been tagged as Reviewed',
                'success'
            );

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: 'Try the transaction again'
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