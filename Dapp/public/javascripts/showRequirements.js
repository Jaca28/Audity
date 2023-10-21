import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { dataAddress, dataAbi } from "../javascripts/contractData.js";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
let accounts = await window.ethereum.request({ method: 'eth_accounts' });
const signer = provider.getSigner();

const data = new ethers.Contract(dataAddress, dataAbi, signer);

var ElementRequirements = document.getElementById("requirements");
var userProjects = await data.getProjectsByUser(accounts[0]);
var projectId = userProjects[0];
console.log('el id de proyect por defecto es: ' +projectId)
var requirements = await data.projectRequirementCount(projectId);

for (let i = 1; i <= requirements; i++) {
    var opt = document.createElement("option");
    const requirementName = await data.projectRequirementName(projectId, i);
    console.log("el id del requisito es:" + i);
    console.log("el nombre del requisito es:" + requirementName);
    opt.value = i;
    opt.innerHTML = requirementName;
    ElementRequirements.appendChild(opt);
}

document.getElementById("projects").onchange = async function() {
    document.getElementById("requirements").innerHTML = "";
    var projectId = document.getElementById("projects").value;
    var requirements = await data.projectRequirementCount(projectId);

    for (let i = 1; i <= requirements; i++) {
        var opt = document.createElement("option");
        const requirementName = await data.projectRequirementName(projectId, i);
        console.log("el id del requisito es:" + i);
        console.log("el nombre del requisito es:" + requirementName);
        opt.value = i;
        opt.innerHTML = requirementName;
        ElementRequirements.appendChild(opt);
    }
};