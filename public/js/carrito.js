const token = localStorage.getItem('token');
const itemList = document.querySelector('.items');
const pay = document.querySelector('.pay-btn');

itemList.innerHTML = '';

function fillCart() {
    let url = '/api/cart';
    let settings = {
        method: 'GET',
        headers: {
            sessiontoken: token
        }
    };
    itemList.innerHTML = '';
    fetch(url, settings).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJSON => {
        if (responseJSON.game) {
            itemList.innerHTML = `<div class="item"><div><img src="${responseJSON.game.image}" alt="${responseJSON.game.gamename}"></div><div class="price-container"><div class="remove-cart"><button class="remove-cart-btn">Remove</button></div><div class="price"><h2>Price</h2><p>${responseJSON.game.price}</p></div><div class="quantity"><h2>Quantity</h2><p>1</p></div><div class="total"><h2>Total</h2><p>$ ${responseJSON.game.price}</p></div></div></div>`;
        }
    }).catch(err => {
        console.log(err);
    });
}

function watchRemove() {
    itemList.addEventListener('click', event => {
        event.preventDefault();
        if (event.target.classList.contains('remove-cart-btn')) {
            fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    sessiontoken: token
                }
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            }).then(responseJSON => {
                console.log(responseJSON);
                fillCart();
            }).catch(err => console.log(err));
        }
    });
}

function watchPay() {
    pay.addEventListener('click', event => {
        event.preventDefault();
        fetch('/api/pay', {method: 'POST', headers: {sessiontoken: token}}).then(response => {
            if(response.ok && response.status === 200) {
                fetch('/api/cart', {
                    method: 'DELETE',
                    headers: {
                        sessiontoken: token
                    }
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.statusText);
                }).then(responseJSON => {
                    console.log(responseJSON);
                    fillCart();
                }).catch(err => console.log(err));
            }
            throw new Error(response.statusText);
        }).catch(err => console.log(err));
    });
}

function init() {
    fillCart();
    watchRemove();
    watchPay();
}

init();
