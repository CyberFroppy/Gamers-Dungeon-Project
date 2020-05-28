import verifyAdmin from '/js/verifyAdmin.js';

const orderTable = document.querySelector('.order-table');
const addOrderButton = document.querySelector('.order-btn');
const addFoodButton = document.querySelector('.add-btn');
const updateFoodButton = document.querySelector('.update-btn');
const editButton = document.querySelector('.edit-btn');
const tableField = document.querySelector('#table');
const nameField = document.querySelector('#name-field');
const errorMessage = document.querySelector('.error');
const foodNameField = document.querySelector('#food-name-field');
const idField = document.querySelector('#id-field');
const priceField = document.querySelector('#price-field');
const adminError = document.querySelector('.admin-error');
const orderDiv = document.querySelector('.order');
const cancelOrder = document.querySelector('.cancel-btn');
const ordersUrl = '/api/orders';
const foodUrl = '/api/food';

errorMessage.innerHTML = '';
adminError.innerHTML = '';
orderDiv.innerHTML = '';

function updateOrder() {
    let divs = orderTable.getElementsByTagName('div');
    orderDiv.innerHTML = '';
    for (let food of divs) {
        let quantity = food.getElementsByTagName('input')[0];
        let name = food.getElementsByTagName('p')[0];
        if (Number(quantity.value) > 0) {
            orderDiv.innerHTML += `<div><p>${name.textContent}</p><p>${quantity.value}</p></div>`;
        }
    }
}

function watchCancel() {
    cancelOrder.addEventListener('click', event => {
        event.preventDefault();
        let divs = orderTable.getElementsByTagName('div');
        for (let food of divs) {
            let quantity = food.getElementsByTagName('input')[0];
            quantity.value = '0';
        }
        updateOrder();
    });
}

function foodEndpoint(method) {
    let url = foodUrl;
    let id = idField.value;
    let token = localStorage.getItem('token');
    let foodInfo = {
        id,
        price: priceField.value,
        name: foodNameField.value
    };
    let settings = {
        method,
        headers: {
            sessiontoken: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(foodInfo)
    };
    if (method === 'PATCH') {
        url += `/${id}`;
    }
    fetch(url, settings).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        loadFood();
        console.log(responseJSON);
    }).catch(err => {
        console.log(err);
        adminError.innerHTML = '<span>Operation error</span>';
    });
}

function watchAddFood() {
    addFoodButton.addEventListener('click', event => {
        event.preventDefault();
        foodEndpoint('POST');
    });
}

function watchEditFood() {
    updateFoodButton.addEventListener('click', event => {
        event.preventDefault();
        foodEndpoint('PATCH');
    });
}

function watchFill() {
    editButton.addEventListener('click', event => {
        event.preventDefault();
        let id = idField.value;
        let url = foodUrl + `/${id}`;
        fetch(url, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(responseJSON => {
            foodNameField.value = responseJSON.name;
            priceField.value = responseJSON.price;
        }).catch(err => {
            console.log(err);
            adminError.innerHTML = '<span>Could not fill that id</span>';
        });
    });
}

function loadFood() {
    let settings = {
        method: 'GET'
    };
    fetch(foodUrl, settings).then(response => {
        if (response.ok) {
            orderTable.innerHTML = '';
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        let i = 0;
        responseJSON.forEach(food => {
            orderTable.innerHTML += `<div><i class="fas fa-plus-square fa-2x"></i>
                        <i class="fas fa-minus-square fa-2x"></i>
<p>${food.name}</p><p class="admin-section">&nbsp;Id: ${food.id}</p><label for="counter${i}"></label><input id="counter${i} type="number" value="0"></input></div>`;
            i++;
        });
        verifyAdmin();
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
            updateOrder();
        }
        if (event.target.classList.contains('fa-minus-square')) {
            let parentDiv = event.target.parentElement;
            let inputElement = parentDiv.getElementsByTagName('input')[0];
            let currentValue = Number(inputElement.value);
            if (currentValue > 0) {
                inputElement.value = currentValue - 1;
                updateOrder();
            }
        }
    });
}

function createOrder(name, tableNo, food) {
    const foodInfo = {
        name,
        tableNo,
        food
    };
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
            food.push({
                name,
                quantity: inputElement.value
            });
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
    watchFill();
    watchEditFood();
    verifyAdmin();
    watchAddFood();
    watchCancel();
}

init();
