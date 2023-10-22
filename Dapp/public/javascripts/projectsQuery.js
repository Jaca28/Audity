import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, dataAddress, logicAbi, dataAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const signer = provider.getSigner();

const data = new ethers.Contract(dataAddress, dataAbi, signer);
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
let accounts = await window.ethereum.request({ method: 'eth_accounts' });
var totalProjects = await data.ID();

console.log("El total de proyectos configurados es:" + totalProjects)

var userProjects = await data.getProjectsByUser(accounts[0]);

console.log("Los ID's de los proyectos del usuario: " + accounts[0] + "son: " + userProjects);

console.log(userProjects);
const arr = [];
var state;
var requirementsCount = 0
var adminsCount = []
for (let i = 0; i < userProjects.length; i++) {
    const id = parseInt(userProjects[i])
    const project = await data.projects(id - 1);
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    const date = new Date(d.setUTCSeconds(parseInt(project.lastUpdate)));
    const projectId = parseInt(project.idProject);
    console.log(projectId);
    const projectName = project.name;
    console.log(projectName);
    const adminAddr = project.adminAddr;
    if (!adminsCount.includes(adminAddr)) {
        adminsCount.push(adminAddr)
    }
    console.log(adminAddr);
    var state = parseInt(project.state)
    if (state == 0) {
        var state = "CREATED";
    } else if (state == 1) {
        var state = "IN PROCESS"
    } else if (state == 2) {
        var state = "CLOSED"
    }
    console.log(state);
    console.log(parseInt(project.state));
    console.log(date);
    const requirements = parseInt(project.requirements)
    console.log(requirements);
    requirementsCount = requirementsCount + requirements
    arr.push([
        projectId,
        projectName,
        adminAddr,
        state,
        date,
        requirements,
        'Cerrar'
    ])
}

// populate dashboard cards 
$('.count-projects').text(arr.length)
$('.count-requeriments').text(requirementsCount)
$('.count-admins').text(adminsCount.length)

//Código para Datables
//$('#example').DataTable(); //Para inicializar datatables de la manera más simple
var dataId;
$(document).ready(function() {
    $('#projects').DataTable({
        "data": arr,
        "columns": [
            { "title": "Id" },
            { "title": "Name" },
            { "title": "Administrator" },
            { "title": "Status" },
            { "title": "Last update" },
            { "title": "Requirements" },
            { "title": "Close" },
        ],
        "columnDefs": [{
                targets: [5],
                render: function(data, type, row, meta) {

                    if (type === 'display') {
                        const route = '/requirements' + '?' + 'projectId=' + row[0];
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
            },
            {
                targets: [6],
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return $(`<button type="button" class="btn btn-info btn-request" data-row0=${row[0]}>`)
                            .text('Cerrar')
                            .wrap('<div></div>')
                            .parent()
                            .html()
                    } else {
                        return data;
                    }
                }
            }
        ],
        //para cambiar el lenguaje a español
        "language": {
            "lengthMenu": "Showing _MENU_ projects",
            "zeroRecords": "No configured projects found",
            "info": "Showing projects from _START_ of _END_ total _TOTAL_ projects",
            "infoEmpty": "Showing projects from 0 to 0 projects",
            "infoFiltered": "(Fliter of total _MAX_ projects)",
            "sSearch": "Search:",
            "oPaginate": {
                "sFirst": "First",
                "sLast": "Last",
                "sNext": "Next",
                "sPrevious": "Previous"
            },
            "Processing": "Processing...",
        },
        initComplete: function() {
            // document.querySelector(".wallet-img").style.display = "none";
            const divLoadingMessage = document.querySelector('.cover-spin-message');
            const requestBtns = document.querySelectorAll('.btn-request');
            divLoadingMessage.remove()
            $("#contenedor").removeClass("cover-spin");
            requestBtns.forEach(el => {
                $(el).on('click', () => { closeProject(el.dataset.row0) })
            })
        }
    });

});

async function closeProject(projectId) {

    Swal.fire({
        title: 'Are you sure you want to close the project?',
        text: "The requirements will no longer be upgradeable.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Close'
    }).then((result) => {
        if (result.isConfirmed) {
            closeNowProject(projectId);
        }
    })

}

async function closeNowProject(projectId) {
    document.getElementById("contenedorB").style.display = "none";
    document.getElementById("spin").style.display = "block";

    try {
        const tx = await logic.setCloseProject(projectId);
        const receipt = await tx.wait();

        if (receipt) {
            document.getElementById("contenedorB").style.display = "block";

            Swal.fire({
                title: '<strong>Closed Project!</strong>',
                icon: 'success',
                html: 'The project has been closed and its requirements cannot be updated.',
                confirmButtonText: '<a href="/projects" style="color:#fff;border-radius: 10rem;">OK</a> ',
                confirmButtonColor: '#F22E76',
            }).then(function() {
                location.reload();
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
            });
        }
        document.getElementById("spin").style.display = "none";
        document.getElementById("contenedorB").style.display = "block";
    } catch (error) {
        document.getElementById("spin").style.display = "none";
        document.getElementById("contenedorB").style.display = "block";
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.reason,
            footer: '<a href="">Why do I have this issue?</a>'
        });
    }
}