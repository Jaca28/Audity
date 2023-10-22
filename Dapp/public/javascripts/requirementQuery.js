import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, dataAddress, logicAbi, dataAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const signer = provider.getSigner();
const data = new ethers.Contract(dataAddress, dataAbi, signer);
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
let accounts = await window.ethereum.request({ method: 'eth_accounts' });

function getUrl() {
    //Se obtiene el valor de la URL desde el navegador
    var actual = window.location + '';
    //Se realiza la división de la URL
    var split = actual.split("=");
    //Se obtiene el ultimo valor de la URL
    var id = split[split.length - 1];
    console.log(id);
    return id;
}

var projectId = getUrl();

console.log("Página cargada......");
console.log(projectId);
console.log("El id ya en requirements es:" + projectId);

async function showRequirements(projectId) {

    var requirements = await data.projectRequirementCount(projectId);
    console.log("el total de requisitos es:" + requirements);
    var arr = [];
    var requirementName;
    var requirementState;
    var requirementHash;
    var lastUpdate;

    for (let i = 1; i <= requirements; i++) {
        const requirementName = await data.projectRequirementName(projectId, i);
        console.log("la variable de iteración es:" + i);
        console.log("el nombre del requisito es:" + requirementName);
        const state = await data.projectRequirementState(projectId, i);
        if (state == 0) {
            requirementState = "Created";
            requirementHash = "Empty[]"
            lastUpdate = "Empty[]"
        } else if (state == 1) {
            requirementState = "Made"
            requirementHash = await data.projectRequirementHash(projectId, i, 0);
            const history = await data.getMadeHistory(projectId, i);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(history[1])));
            lastUpdate = date.toLocaleString();
            console.log(date);
        } else if (state == 2) {
            requirementState = "Reviewed"
            requirementHash = await data.projectRequirementHash(projectId, i, 1);
            const history = await data.getRevHistory(projectId, i);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(history[1])));
            lastUpdate = date.toLocaleString();
        } else if (state == 3) {
            requirementState = "Approved"
            requirementHash = await data.projectRequirementHash(projectId, i, 2);
            const history = await data.getAppHistory(projectId, i);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(history[1])));
            lastUpdate = date.toLocaleString();
        }
        console.log("el estado del requisito es:" + requirementState);
        console.log("el hash del requisito es:" + requirementHash);
        console.log(history);
        requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
        arr.push([
            i,
            requirementName,
            requirementState,
            requirementHash,
            lastUpdate,
            'See'
        ]);
    }
    $(document).ready(function() {
        $('#requirements').DataTable({
            "data": arr,
            "columns": [
                { "title": "Requirement Id" },
                { "title": "Name" },
                { "title": "Status" },
                { "title": "Hash" },
                { "title": "Last update" },
                { "title": "Historical" },
            ],
            "columnDefs": [{
                targets: [5],
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        const route = '../historical' + '?' + 'projectId&requirementId=' + projectId + '-' + row[0];
                        return $('<a>')
                            .attr('href', route)
                            .text(data)
                            .wrap('<div></div>')
                            .parent()
                            .html()
                    } else {
                        return data;
                    }
                }
            }],
            //para cambiar el lenguaje a español
            "language": {
                "lengthMenu": "Showing _MENU_ Requirements",
                "zeroRecords": "No configured requirements found",
                "info": "Showing requirements from _START_ al _END_ to _TOTAL_ requirements",
                "infoEmpty": "Showing requirements from  0 to 0 requirements",
                "infoFiltered": "(Fliter of total  _MAX_ requirements)",
                "sSearch": "Search:",
                "oPaginate": {
                    "sFirst": "First",
                    "sLast": "Last",
                    "sNext": "Next",
                    "sPrevious": "Previous"
                },
                "sProcessing": "Processing...",
            },
            initComplete: function () {
                // document.querySelector(".wallet-img").style.display = "none";
                const divLoadingMessage = document.querySelector('.cover-spin-message');
                divLoadingMessage.remove()
                $("#contenedor").removeClass("cover-spin");
            }
        });

    });

}

showRequirements(projectId);