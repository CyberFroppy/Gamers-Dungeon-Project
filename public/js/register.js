const registrationForm = document.querySelector('.form');
const userField = document.querySelector('#user-field');
const emailField = document.querySelector('#email-field');
const passwordField = document.querySelector('#password-field');
const url = "/api/register";
const errorElement = document.querySelector('.error');


function registerUser(username, password) {
    let userInfo = {
        username,
        password
    };
    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    };
    fetch(url, settings).then(response => {
        if (response.ok && response.status == 201) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    }).then(responseJSON => {
        localStorage.setItem('token', responseJSON.token);
        window.location.href = "/";
        errorElement.style.display = 'none';
    }).catch(_ => {
        errorElement.style.display = 'block';
    });
}

function watchRegistrationForm() {
    registrationForm.addEventListener('submit', event => {
        event.preventDefault();
        let username = userField.value;
        let password = passwordField.value;
        registerUser(username, password);
    });
}

function init() {
    watchRegistrationForm();
}

init();
