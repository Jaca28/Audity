
const securityTextButton = document.getElementById('security-text')
const availabilityTextButton = document.getElementById('info-availability')
const trazTextButton = document.getElementById('traz-btn')


texto1 = `The Audity  platform operates with a role-based access system to interact with the data and function calls, limiting access and permissions to view, modify and
and function calls, limiting access and permissions for visualization, modification and other functionalities.
functionalities.
<br/>
<br/>
The credentials through which the roles are defined use public key cryptography,
allowing compatibility with Web wallets3.`

texto2 = `The distributed and decentralized properties of the blockchain allow data to be accessed remotely and securely.
remotely and securely. The smart contracts used in Audity are deployed and accessed through an Ethereum Virtual Machine (EVM)-based blockchain.
through a blockchain based on Ethereum Virtual Machine (EVM).`

texto3 = `The block chaining and indexing of the records by means of the project identifier and the requirements identifier, allows to consult the entire history of records related to any of the
requirements identifier, allows to consult the entire history of records related to any of the documents.
documents.`

securityTextButton.addEventListener('click', function () {
    Swal.fire({
        title: '<strong>Security and Control Access</strong>',
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
        title: '<strong>Information Availability</strong>',
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
        title: '<strong>Information traceability</strong>',
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