const registrationButton = document.querySelector('.register-btn');
const reservations = document.querySelector('.reservaciones-semana');
const nameField = document.querySelector('#name-field');
const dateField = document.querySelector('#date-field');
const hourField = document.querySelector('#hour-field');
const peopleField = document.querySelector('#people');
const gamesField = document.querySelector('#games');
const tableField = document.querySelector('#table');
const errorMessage = document.querySelector('.error');

errorMessage.innerHTML = '';

const url = "/api/reservation";

function makeRegistration(name, date, hour, people, game, tableNo) {
    const registrationData = {
        reservationName: name,
        tableNo,
        date: date + " " + hour,
        game,
        people
    };
    console.log(registrationData);
    const token = localStorage.getItem('token');
    const settings = {
        method: 'POST',
        headers: {
            sessiontoken: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
    };
    fetch(url, settings)
        .then(result => {
            if (result.ok && result.status === 201) {
                return result.json();
            }
            throw new Error(result.statusText);
        }).then(createdRegistration => {
            console.log(createdRegistration);
            fillReservations();
        }).catch(err => {
            console.log(err.message);
        });
}

function fillReservations() {
    reservations.innerHTML = '';
    fetch('/api/reservation', {method: 'GET'}).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        for (reservation of responseJSON) {
            reservations.innerHTML += `<div class="reservation"><div class="nombre"><p>${reservation.reservationName}</p></div><div class="mesa"><p>Table ${reservation.tableNo}</p></div><div class="fecha"><p>Start time ${reservation.date}</p></div><div class="juego"><p>Game: ${reservation.game}</p></div><div class="personas"><p>People: ${reservation.people}</p></div></div>`;
        }
    }).catch(err => {
        console.log(err);
    });
}

function fillGames() {
    fetch('/api/games', {
            method: 'GET'
        })
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(responseJSON => {
            games.innerHTML = '<option value="-">-</option>';
            for (game of responseJSON) {
                games.innerHTML += `<option value="${game.gamename}">${game.gamename}</option>`;
            }
        }).catch(err => console.log(err.message));
}

function watchRegistrationForm() {
    registrationButton.addEventListener('click', event => {
        event.preventDefault();
        const name = nameField.value;
        const date = dateField.value;
        const hour = hourField.value;
        const people = peopleField.options[peopleField.selectedIndex].value;
        const game = gamesField.options[gamesField.selectedIndex].value;
        const tableNo = tableField.options[tableField.selectedIndex].value;
        if (tableNo === "-" || people === "-" || name === "" || date === "" || hour === "") {
            console.log("Error");
        } else {
            makeRegistration(name, date, hour, people, game, tableNo);
        }
    });
}

function init() {
    fillGames();
    watchRegistrationForm();
    fillReservations();
}

init();
