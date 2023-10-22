import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, dataAddress, dataAbi } from "../javascripts/contractData.js"
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const ETH_EXPLORER = 'https://sepolia-blockscout.scroll.io/'

const signer = provider.getSigner();
const data = new ethers.Contract(dataAddress, dataAbi, signer);

function getUrl() {
    //Se obtiene el valor de la URL desde el navegador
    var actual = window.location + '';
    console.log("actual es:" + actual);
    //Se realiza la división de la URL
    var split = actual.split("=");
    console.log("Split es:" + split);
    // var splitRequirement = actual.split("*");
    //Se obtiene el ultimo valor de la URL
    var id = split[split.length - 1];
    var dva = id.split("-");
    var idProject = dva[0];
    var idRequirement = dva[1];
    console.log("DVA es:" + dva);
    console.log("El id del proyecto es: " + idProject);
    console.log("El largo es: " + dva.length);
    console.log("El id del requisito es: " + idRequirement);
    // var requirementId = split[splitRequirement.length - 1];
    console.log(id);
    // console.log(requirementId);
    // console.log("El id del requirement luego del split es:" + requirementId);
    return [idProject, idRequirement];
}

const values = getUrl();
var projectId = values[0];
var requirementId = values[1];

console.log("Página cargada......");
console.log("El id ya en requirements es:" + projectId);
console.log("El requisito en historical es" + requirementId);

async function showHistorical(projectId, requirementId) {

    var arr = [];
    var requirementName;
    var requirementAddrSearch;
    var requirementState;
    var requirementHash;
    var requirementAddr;
    var lastUpdate;
    var madeHistory;
    var hashHistory;
    var dateHistory;
    var addrHistory;

    requirementState = await data.projectRequirementState(projectId, requirementId);
    var state = parseInt(requirementState)
    console.log("el estado del requisito es:" + state);

    if (state == 0) {
        console.log("No hay Histórico de requisitos...")
    } else if (state == 1) {
        madeHistory = await data.getMadeHistory(projectId, requirementId);
        requirementState = "Made"
        hashHistory = madeHistory[0];
        dateHistory = madeHistory[1];
        addrHistory = madeHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i];
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
            requirementAddr = requirementAddr.slice(0,5) + '...' + requirementAddr.substring(requirementAddr.length - 5);
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

        madeHistory = await data.getMadeHistory(projectId, requirementId);
        requirementState = "Made"
        hashHistory = madeHistory[0];
        dateHistory = madeHistory[1];
        addrHistory = madeHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i]
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
            requirementAddr = requirementAddr.slice(0,5) + '...' + requirementAddr.substring(requirementAddr.length - 5);
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
            requirementHash = hashHistory[i]
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
            requirementAddr = requirementAddr.slice(0,5) + '...' + requirementAddr.substring(requirementAddr.length - 5);
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

        madeHistory = await data.getMadeHistory(projectId, requirementId);
        requirementState = "Made"
        hashHistory = madeHistory[0];
        dateHistory = madeHistory[1];
        addrHistory = madeHistory[2];
        for (let i = 0; i < hashHistory.length; i++) {
            console.log("el hash en la posición:" + i + 'es:' + hashHistory[i]);
            console.log("la fecha en la posicioón:" + i + 'es:' + dateHistory[i]);
            requirementHash = hashHistory[i]
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
            requirementAddr = requirementAddr.slice(0,5) + '...' + requirementAddr.substring(requirementAddr.length - 5);
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
            requirementHash = hashHistory[i]
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
            requirementAddr = requirementAddr.slice(0,5) + '...' + requirementAddr.substring(requirementAddr.length - 5);
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
            requirementHash = hashHistory[i]
            requirementAddr = addrHistory[i];
            requirementAddrSearch = requirementAddr;
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            const date = new Date(d.setUTCSeconds(parseInt(dateHistory[i])));
            lastUpdate = date.toLocaleString();
            requirementHash = requirementHash.slice(0,5) + '...' + requirementHash.substring(requirementHash.length - 5);
            requirementAddr = requirementAddr.slice(0,5) + '...' + requirementAddr.substring(requirementAddr.length - 5);
            arr.push([
                projectId,
                requirementId,
                requirementState,
                requirementHash,
                lastUpdate,
                requirementAddr
            ])
        }

    }

    $(document).ready(function() {
        $('#historical').DataTable({
            "data": arr,
            "columns": [
                { "title": "Id proyecto" },
                { "title": "Id Requisito" },
                { "title": "Estado" },
                { "title": "Hash" },
                { "title": "Fecha" },
                { "title": "Responsable" },
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
            //para cambiar el lenguaje a español
            "language": {
                "lengthMenu": "Mostrar _MENU_ Requisitos",
                "zeroRecords": "No se encontraron datos históricos",
                "info": "Mostrando Requisitos del _START_ al _END_ de un total de _TOTAL_ requisitos",
                "infoEmpty": "Mostrando proyectos del 0 al 0 de un total de 0 requisitos",
                "infoFiltered": "(filtrado de un total de _MAX_ requisitos)",
                "sSearch": "Buscar:",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "sProcessing": "Procesando...",
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

showHistorical(projectId, requirementId);