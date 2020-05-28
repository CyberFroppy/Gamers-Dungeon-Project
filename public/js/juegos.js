import verifyAdmin from '/js/verifyAdmin.js';

const gameList = document.querySelector('.game-list');
const addBtn = document.querySelector('.add-btn');
const editBtn = document.querySelector('.edit-btn');
const updateBtn = document.querySelector('.update-btn');
const idField = document.querySelector('#id-field');
const nameField = document.querySelector('#name-field');
const descriptionField = document.querySelector('#description-field');
const stockField = document.querySelector('#stock-field');
const priceField = document.querySelector('#price-field');
const errorMessage = document.querySelector('.error');

function fillGame() {
    let id = idField.value;
    let url = `/api/games/${id}`;
    let settings = {
        method: 'GET'
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(responseJSON => {
            nameField.value = responseJSON.gamename;
            descriptionField.value = responseJSON.description;
            stockField.value = responseJSON.stock;
            priceField.value = responseJSON.price;
        }).catch(err => {
            console.log(err);
            errorMessage.inerHTML = '<span>No game with specified id</span>';
        });
}

function gameEndpoint(method) {
    let url = "/api/games";
    if (method === 'PATCH') {
        let id = idField.value;
        url += `/${id}`;
    }
    let token = localStorage.getItem('token');
    let gameInfo = {
        id: idField.value,
        gamename: nameField.value,
        description: descriptionField.value,
        stock: stockField.value,
        price: priceField.value
    };
    let settings = {
        method,
        headers: {
            'Content-Type': 'application/json',
            sessiontoken: token
        },
        body: JSON.stringify(gameInfo)
    };
    fetch(url, settings).then(response => {
        if (response.ok && (response.status === 201 || response.status === 202)) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        console.log(responseJSON);
        errorMessage.innerHTML = '<span>Operation successful</span>';
        loadGames();
    }).catch(err => {
        errorMessage.innerHTML = '<span>Something went wrong</span>';
        console.log(err.message);
    });
}

function watchGameAdd() {
    addBtn.addEventListener('click', event => {
        event.preventDefault();
        gameEndpoint('POST');
    });
}

function watchGameEdit() {
    updateBtn.addEventListener('click', event => {
        event.preventDefault();
        gameEndpoint('PATCH');
    });
}

function watchFill() {
    editBtn.addEventListener('click', event => {
        event.preventDefault();
        fillGame();
    });
}

function loadGames() {
    const url = '/api/games';
    const settings = {
        method: 'GET'
    };
    fetch(url, settings).then(response => {
        if (response.ok && response.status === 200) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        gameList.innerHTML = '';
        console.log(responseJSON);
        responseJSON.forEach(game => {
            gameList.innerHTML += `<div class="game"><div><img src="${game.image}"></div><div class="descrip-id">
<div class="id admin-section"><h2>ID</h2><p>${game.id}</p></div><div class="description"><h2>Description</h2>
<p>${game.description}</p></div><div class="button-container"><div class="stock"><h2>In stock</h2><p>${game.stock}</p>
</div><div class="price><h2>Price</h2><p>${game.price}</p></div><div class="add-cart"><button class="add-cart-btn">Add to Cart</button></div>
<div class="delete admin-section"><button class="delete-btn" game=${game.id}><i class="fas fa-trash-alt"></i></button></div></div></div>`;
        });
        verifyAdmin();
    }).catch(err => console.log(err));
}

function watchGameList() {
    gameList.addEventListener('click', event => {
        event.preventDefault();
        if (event.target.classList.contains('delete-btn')) {
            const token = localStorage.getItem('token');
            const id = event.target.getAttribute('game');
            const url = `/api/games/${id}`;
            const settings = {
                method: 'DELETE',
                headers: {
                    sessiontoken: token
                }
            };
            fetch(url, settings).then(response => {
                if (response.ok && response.status === 200) {
                    loadGames();
                } else {
                    throw new Error(response.statusMessage);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    });
}

function init() {
    loadGames();
    watchGameAdd();
    watchGameEdit();
    watchFill();
    watchGameList();
}

init();
