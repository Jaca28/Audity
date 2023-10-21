import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";

import { logicAddress, dataAddress, logicAbi, dataAbi } from "../javascripts/contractData.js";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const data = new ethers.Contract(dataAddress, dataAbi, signer);
let accounts = await window.ethereum.request({ method: 'eth_accounts' });
var totalProjects = await data.ID();

console.log("El total de proyectos configurados es:" + totalProjects)

var userProjects = await data.getProjectsByUser(accounts[0]);

console.log("Los ID's de los proyectos del usuario: " + accounts[0] + "son: " + userProjects);

/* console.log(userProjects[0]); */

var projectId

var projects = document.getElementById('projects');

for (let i = 0; i < userProjects.length; i++) {
    const id = parseInt(userProjects[i])
    const project = await data.projects(id - 1);
    projectId = parseInt(project.idProject);
    console.log("El id del  proyecto es:" + projectId);
    const projectName = project.name;
    console.log(projectName);
    var opt = document.createElement('option');
    opt.value = projectId;
    opt.innerHTML = projectName;
    projects.appendChild(opt);
}
