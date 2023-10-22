import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, dataAddress, dataAbi } from "../javascripts/contractData.js"
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const ETH_EXPLORER = 'https://sepolia-blockscout.scroll.io/'

const signer = provider.getSigner();
const data = new ethers.Contract(dataAddress, dataAbi, signer);
const hashQueryButton = document.getElementById('hashQueryButton')


async function getData(hash) {
    const projectData = await data.getInfoByHash(hash);
    const idProject = projectData[0];
    const idRequirement = projectData[1];
    return [idProject, idRequirement];
}

document.querySelector(".tableHashQuery").style.display = "none";

hashQueryButton.addEventListener('click', async(e) => {
    e.preventDefault();

    document.querySelector(".hashForm").style.display = "none";

    var hash = document.getElementById('file_hash').innerHTML;
    console.log("EL hash desde query es: " + hash);

    const values = await getData(hash);
    var projectId = values[0];
    var requirementId = values[1];

    console.log("Página cargada......");
    console.log("Los datos son:" + values);
    console.log("El id ya en requirements es:" + projectId);
    console.log("El requisito en historical es" + requirementId);

    var arr = [];
    var requirementState;
    var requirementHash;
    var requirementAddr;
    var requirementAddrSearch;
    var lastUpdate;
    var madeHistory;
    var hashHistory;
    var dateHistory;
    var addrHistory;

    requirementState = await data.projectRequirementState(projectId, requirementId);
    var state = parseInt(requirementState)
    console.log("el estado del requisito es:" + state);

    if (state == 0) {
        document.querySelector(".tableHashQuery").style.display = "flex";
        console.log("No hay Histórico de requisitos...")
    } else if (state == 1) {
        document.querySelector(".tableHashQuery").style.display = "flex";
        madeHistory = await data.getMadeHistory(projectId, requirementId);
        requirementState = "Made"
        hashHistory = madeHistory[0];
        dateHistory = madeHistory[1];
        addrHistory = madeHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i].slice(0,5);
            requirementHash = hashHistory[i].slice(0,5) + '...' + hashHistory[i].substring(hashHistory[i].length - 5);
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            requirementAddr = addrHistory[i].slice(0,5) + '...' + addrHistory[i].substring(addrHistory[i].length - 5);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                date.toLocaleString(),
                requirementAddr
            ])
        }

    } else if (state == 2) {
        document.querySelector(".tableHashQuery").style.display = "flex";
        madeHistory = await data.getMadeHistory(projectId, requirementId);
        requirementState = "Made"
        hashHistory = madeHistory[0];
        dateHistory = madeHistory[1];
        addrHistory = madeHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i].slice(0,5);
            requirementHash = hashHistory[i].slice(0,5) + '...' + hashHistory[i].substring(hashHistory[i].length - 5);
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            requirementAddr = addrHistory[i].slice(0,5) + '...' + addrHistory[i].substring(addrHistory[i].length - 5);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                lastUpdate,
                requirementAddr
            ])
        }

        var revHistory = await data.getRevHistory(projectId, requirementId);
        requirementState = "Reviewed"
        hashHistory = revHistory[0];
        dateHistory = revHistory[1];
        addrHistory = revHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i].slice(0,5);
            requirementHash = hashHistory[i].slice(0,5) + '...' + hashHistory[i].substring(hashHistory[i].length - 5);
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            requirementAddr = addrHistory[i].slice(0,5) + '...' + addrHistory[i].substring(addrHistory[i].length - 5);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                lastUpdate,
                requirementAddr
            ])
        }
    } else if (state == 3) {
        document.querySelector(".tableHashQuery").style.display = "flex";
        madeHistory = await data.getMadeHistory(projectId, requirementId);
        requirementState = "Made"
        hashHistory = madeHistory[0];
        dateHistory = madeHistory[1];
        addrHistory = madeHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i].slice(0,5);
            requirementHash = hashHistory[i].slice(0,5) + '...' + hashHistory[i].substring(hashHistory[i].length - 5);
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            requirementAddr = addrHistory[i].slice(0,5) + '...' + addrHistory[i].substring(addrHistory[i].length - 5);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                lastUpdate,
                requirementAddr
            ])
        }

        var revHistory = await data.getRevHistory(projectId, requirementId);
        requirementState = "Reviewed"
        hashHistory = revHistory[0];
        dateHistory = revHistory[1];
        addrHistory = revHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i].slice(0,5);
            requirementHash = hashHistory[i].slice(0,5) + '...' + hashHistory[i].substring(hashHistory[i].length - 5);
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            requirementAddr = addrHistory[i].slice(0,5) + '...' + addrHistory[i].substring(addrHistory[i].length - 5);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                lastUpdate,
                requirementAddr
            ])
        }

        var appHistory = await data.getAppHistory(projectId, requirementId);
        requirementState = "Approved"
        hashHistory = appHistory[0];
        dateHistory = appHistory[1];
        addrHistory = appHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i].slice(0,5);
            requirementHash = hashHistory[i].slice(0,5) + '...' + hashHistory[i].substring(hashHistory[i].length - 5);
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            requirementAddr = addrHistory[i].slice(0,5) + '...' + addrHistory[i].substring(addrHistory[i].length - 5);
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                lastUpdate,
                requirementAddr
            ])
        }
        document.querySelector(".tableHashQuery").style.display = "block";
    }

    $(document).ready(function() {
        $('#historical').DataTable({
            "data": arr,
            "columns": [
                { "title": "Project ID" },
                { "title": "Requirement ID" },
                { "title": "Status" },
                { "title": "Hash" },
                { "title": "Date" },
                { "title": "Manager" },
            ],

            "columnDefs": [{
                targets: [5],
                render: function(data, type, row, meta) {

                    if (type === 'display') {
                        const route = ETH_EXPLORER + `/address/${logicAddress}?fromaddress=${requirementAddrSearch}`;
                        return $('<a target="_blank">')
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
            "bDestroy": true,
            //para cambiar el lenguaje a español
            "language": {
                "lengthMenu": "Showing _MENU_ Requirements",
                "zeroRecords": "No historical data found",
                "info": "Showing Requirements from _START_ to _END_ of _TOTAL_ requirements",
                "infoEmpty": "Showing requirements from 0 to 0 of 0 requirements",
                "infoFiltered": "(filter of total _MAX_ requirements)",
                "sSearch": "Search:",
                "oPaginate": {
                    "sFirst": "First",
                    "sLast": "Last",
                    "sNext": "Next",
                    "sPrevious": "Previous"
                },
                "sProcessing": "Processing...",
            }
        });
    });
})