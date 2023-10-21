
const securityTextButton = document.getElementById('security-text')
const availabilityTextButton = document.getElementById('info-availability')
const trazTextButton = document.getElementById('traz-btn')


texto1 = `La plataforma Block E Design opera con un sistema de acceso por roles para interactuar con los datos y
los llamados a las funciones, limitando accesos y permisos de visualización, modificación y otras
funcionalidades.
<br/>
<br/>
Las credenciales por medio de las cuales se definen los roles, usan la criptografía de llave pública,
permitiendo la compatibilidad con las billeteras Web3.`

texto2 = `Las propiedades distribuidas y descentralizadas de la blockchain permiten acceder a los datos de manera
remota y segura. Los contratos inteligentes usados en Block E Design, son desplegados y accedidos a
través de una blockchain basada en Ethereum Virtual Machine (EVM).`

texto3 = `El encadenamiento de bloques y la indexación de los registros mediante el identificador de proyectos y
de requisitos, permite consultar todo el histórico de registros relacionados con cualquiera de los
documentos.`

securityTextButton.addEventListener('click', function () {
    Swal.fire({
        title: '<strong>Seguridad y control de acceso</strong>',
        imageUrl: 'images/ethereum2.jfif',
        html: texto1,
        allowOutsideClick: true,
        showCloseButton: true,
        closeOnCancel: true,
        focusConfirm: false,
        confirmButtonText: '<a style="color:#fff;border-radius: 10rem;">OK</a> ',
        confirmButtonColor: '#F22E76',
    })
});

availabilityTextButton.addEventListener('click', function () {
    Swal.fire({
        title: '<strong>Disponibilidad de la Información</strong>',
        imageUrl: 'images/emv.jfif',
        imgWidth: 400,
        imgHeight: 100,
        html: texto2,
        allowOutsideClick: true,
        showCloseButton: true,
        closeOnCancel: true,
        focusConfirm: false,
        confirmButtonText: '<a style="color:#fff;border-radius: 10rem;">OK</a> ',
        confirmButtonColor: '#F22E76',
    })
});

trazTextButton.addEventListener('click', function () {
    Swal.fire({
        title: '<strong>Trazabilidad de información</strong>',
        imageUrl: 'images/ethereum.png',
        imgWidth: 400,
        imgHeight: 100,
        html: texto3,
        allowOutsideClick: true,
        showCloseButton: true,
        closeOnCancel: true,
        focusConfirm: false,
        confirmButtonText: '<a style="color:#fff;border-radius: 10rem;">OK</a> ',
        confirmButtonColor: '#F22E76',
    })
});