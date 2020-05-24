const loginForm = document.querySelector('.form');
const userField = document.querySelector('#user-field');
const passwordField = document.querySelector('#password-field');
const url = "/api/login";
const errorElement = document.querySelector('.error');


function loginUser(username, password) {
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
    }).catch(_ => {
        errorElement.style.display = 'block';
    });
}

function watchLoginForm() {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        let username = userField.value;
        let password = passwordField.value;
        loginUser(username, password);
    });
}

function init() {
    watchLoginForm();
}

init();
