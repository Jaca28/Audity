import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.js";
import { logicAddress, dataAddress, logicAbi, dataAbi } from "../javascripts/contractData.js"

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const signer = provider.getSigner();

const data = new ethers.Contract(dataAddress, dataAbi, signer);
const logic = new ethers.Contract(logicAddress, logicAbi, signer);
var totalRegisterRequest = await data.getRegisterRequestIndex();

console.log("El total de solicitudes es:" + totalRegisterRequest)

const arr = [];

for (let i = 0; i < totalRegisterRequest; i++) {
    const request = await data.registerRequests(i);
    const requestId = i;
    console.log(requestId);
    const userAddr = request.userAddr;
    console.log(userAddr);
    const role = request.role;
    console.log(role);
    const attend = request.attendState;

    if (attend == 0) {
        arr.push([
            requestId,
            userAddr,
            role,
            'Aceptar',
            'Rechazar'
        ])
    }

}

// populate dashboard cards 
$('.count-all-request').text(totalRegisterRequest)
$('.count-pending-request').text(arr.length)

//Código para Datables
$(document).ready(function() {
    $('#requests').DataTable({
        "data": arr,
        "columns": [
            { "title": "Id de Solicitud" },
            { "title": "Dirección de Usuario" },
            { "title": "Rol" },
            { "title": "Aceptar" },
            { "title": "Rechazar" },
        ],
        "columnDefs": [{
                targets: 3,
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return $(`<button type="button" class="btn btn-secondary btn-request" data-row0=${row[0]} data-row1=${row[1]} data-row2=${row[2]} data-value=${1} >`)
                            .text('Aceptar')
                            .wrap('<div></div>')
                            .parent()
                            .html()
                    } else {
                        return data;
                    }
                }
            },
            {
                targets: 4,
                render: function(data, type, row, meta) {
                    if (type === 'display') {
                        return $(`<button type="button" class="btn btn-info btn-request" data-row0=${row[0]} data-row1=${row[1]} data-value=${2} >`)
                            .text('Rechazar')
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
            "lengthMenu": "Mostrar _MENU_ Solicitudes de registro",
            "zeroRecords": "No se encontraron solicitudes de registro",
            "info": "Mostrando solicitudes de registro del _START_ al _END_ de un total de _TOTAL_ solicitudes de registro",
            "infoEmpty": "Mostrando solicitudes de registro del 0 al 0 de un total de 0 solicitudes de registro",
            "infoFiltered": "(filtrado de un total de _MAX_ solicitudes de registro)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "Processing": "Procesando...",
        },
        initComplete: function() {
            const divLoadingMessage = document.querySelector('.cover-spin-message');
            const requestBtns = document.querySelectorAll('.btn-request');
            divLoadingMessage.remove()
            $("#contenedor").removeClass("cover-spin");
            requestBtns.forEach(el => {
                $(el).on('click', () => { approveRegister(el.dataset.row0, el.dataset.row1, el.dataset.row2, el.dataset.value) })
            })
        }
    });

});

async function approveRegister(idRegisterRequest, userAddr, role, value) {
    document.querySelector(".show").style.display = "none";
    document.querySelector(".cover-spin").style.display = "block";

    console.log("idRegisterRequest", idRegisterRequest);
    console.log("userAddr", userAddr);
    console.log("Value", value);
    try {
        const tx = await logic.setRegisterRequest(idRegisterRequest, value, signer.getAddress());
        const receipt = await tx.wait();

        if (receipt) {
            document.querySelector(".show").style.display = "block";

            if (value == 1) {

                Swal.fire({
                    title: '<strong>Configura el usuario y asigna un proyecto</strong>',
                    icon: 'success',
                    html: 'La dirección pública: ' + userAddr + ' ha sido registrada',
                    confirmButtonText: `<a href="/grantRole?user=${userAddr}&role=${role}&value=${2}" style="color:#fff;border-radius: 10rem;">Configurar</a>`,
                    confirmButtonColor: '#F22E76',
                }).then(function() {
                    location.reload();
                });

            } else if (value == 2) {

                Swal.fire({
                    title: '<strong>Solicitud Rechazada</strong>',
                    icon: 'error',
                    html: ' El registro de la dirección pública: ' + userAddr + ' ha sido rechazado',
                    confirmButtonText: '<a href="/approveRegisterRequest" style="color:#fff;border-radius: 10rem;">OK</a> ',
                    confirmButtonColor: '#F22E76',
                }).then(function() {
                    location.reload();
                });

            }


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
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
            footer: '<a href="">Why do I have this issue?</a>'
        });
    }
}