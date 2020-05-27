const contactButton = document.querySelector('.send-btn');
const nameField = document.querySelector('#name-field');
const emailField = document.querySelector('#email-field');
const subjectField = document.querySelector('#subject-field');
const messageField = document.querySelector('#message-field');
const errorMessage = document.querySelector('.error');
const url = '/api/sendmail';

function sendMessage(mailname, email, subject, message) {
    const mailInfo = {
        name: mailname,
        mail: email,
        subject,
        message
    };
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mailInfo)
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok && response.status === 200) {
                errorMessage.innerHTML = '<span>Message sent!</span>';
            } else {
                throw new Error(response.statusText);
            }
        }).catch(err => {
            console.log(err);
            errorMessage.innerHTML = `<span>${err.message}</span>`;
        });
}

function watchContactForm() {
    contactButton.addEventListener('click', event => {
        console.log('Sending message');
        event.preventDefault();
        errorMessage.innerHTML = '';
        const mailname = nameField.value;
        const email = emailField.value;
        const subject = subjectField.value;
        const message = messageField.value;
        if (mailname === "" || email === "" || subject === "" || message === "") {
            errorMessage.innerHTML = "<span>All fields must have data</span>";
        } else {
            sendMessage(mailname, email, subject, message);
        }
    });
}

function init() {
    errorMessage.innerHTML = '';
    watchContactForm();
}

init();
