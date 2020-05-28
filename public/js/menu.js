const orderTable = document.querySelector('.order-table');
const addOrderButton = document.querySelector('.order-btn');
const tableField = document.querySelector('#table');
const nameField = document.querySelector('#name-field');
const errorMessage = document.querySelector('.error');
const ordersUrl = '/api/orders';

function loadFood() {
    let url = '/api/food';
    let settings = {
        method: 'GET'
    };
    fetch(url, settings).then(response => {
        if (response.ok) {
            orderTable.innerHTML = '';
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        let i = 0;
        responseJSON.forEach(food => {
            orderTable.innerHTML += `<div><i class="fas fa-plus-square"></i>
                        <i class="fas fa-minus-square"></i>
<p>${food.name}</p><label for="counter${i}"></label><input id="counter${i} type="number" value="0"></input></div>`;
            i++;
        });
    }).catch(err => {
        console.log(err.message);
    });
}

function watchOrderTable() {
    orderTable.addEventListener('click', event => {
        if (event.target.classList.contains('fa-plus-square')) {
            let parentDiv = event.target.parentElement;
            let inputElement = parentDiv.getElementsByTagName('input')[0];
            let currentValue = Number(inputElement.value);
            inputElement.value = currentValue + 1;
        }
        if (event.target.classList.contains('fa-minus-square')) {
            let parentDiv = event.target.parentElement;
            let inputElement = parentDiv.getElementsByTagName('input')[0];
            let currentValue = Number(inputElement.value);
            if (currentValue > 0) {
                inputElement.value = currentValue - 1;
            }
        }
    });
}

function createOrder(name, tableNo, food) {
    const foodInfo = {name, tableNo, food};
    let token = localStorage.getItem('token');
    const settings = {
        method: 'POST',
        headers: {
            sessiontoken: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(foodInfo)
    };
    fetch(ordersUrl, settings).then(response => {
        if (response.ok && response.status === 201) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        console.log(responseJSON);
    }).catch(err => {
        console.log(err.message);
        errorMessage.innerHTML = '<span>Something went wrong creating food</span>';
    });
}

function watchOrderCreation() {
    addOrderButton.addEventListener('click', event => {
        event.preventDefault();
        let food = [];
        let divs = orderTable.getElementsByTagName('div');
        for (let elem of divs) {
            let inputElement = elem.getElementsByTagName('input')[0];
            let name = elem.getElementsByTagName('p')[0].textContent;
            food.push({name, quantity: inputElement.value});
        }
        const name = nameField.value;
        const tableNo = tableField.options[tableField.selectedIndex].value;
        if (name === "" || isNaN(tableNo)) {
            errorMessage.innerHTML = '<span>Missing name or table</span>';
        } else {
            createOrder(name, tableNo, food);
        }
    });
}

function init() {
    loadFood();
    watchOrderTable();
    watchOrderCreation();
}

init();
