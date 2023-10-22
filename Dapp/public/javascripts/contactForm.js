const sendContactForm = document.getElementById('button');

sendContactForm.addEventListener('click', async(e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const contactForm = document.querySelector('#form');


    if (name.length === 0 || email.length === 0 || message.length === 0) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Please fill all fields!',
            showConfirmButton: false,
            timer: 2000
        })
    } else {
        let data = new FormData(contactForm);
        fetch("https://formbold.com/s/3O1e6", { method: "POST", body: data });
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Contact form sended!',
            showConfirmButton: false,
            timer: 2000
        })
        contactForm.reset()
    }

})



// document.querySelector('button').addEventListener('click', (e) => {
//     e.preventDefault();
//     const contactForm = document.querySelector('#form');
//     const name = document.querySelector('[name="name"]');
//     const email = document.querySelector('[name="email"]');
//     const message = document.querySelector('[name="message"]');
//     // validation before sending the data
//     if (name.value.length === 0 || email.value.length === 0 || message.value.length === 0) {
//         alert('Por favor rellene todos los campos')
//     } else {
//         let data = new FormData(contactForm);
//         fetch("https://formbold.com/s/3O1e6", { method: "POST", body: data });
//         Swal.fire(
//             'Formulario de contacto enviado!',
//             'success'
//         );
//         contactForm.reset()
//     }
// })