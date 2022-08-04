BASE_URL = `http://localhost:3000/api/products/`;

// search ID cart__items in the html
let items = document.getElementById('cart__items'),
    // search class cart__order__form in the html
    form = document.querySelector('.cart__order__form'),

    formValidity = true,
    productId = [];

const start =
    async () => {
        // calls the local storage
        for (let product of getCart()) {
            // introduces the elements in the html
            items.insertAdjacentHTML('beforeend', `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
               <div class="cart__item__img">
                 <img src="${product.imageUrl}" alt="${product.altTxt}">
               </div>
               <div class="cart__item__content">
                 <div class="cart__item__content__description">
                   <h2>${product.name}</h2>
                   <p>${product.color}</p>
                   <p>${await priceProduct(product.id)}</p>
                 </div>
                 <div class="cart__item__content__settings">
                   <div class="cart__item__content__settings__quantity">
                     <p>Qté :</p>
                     <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`
            )
            productId.push(product.id);
        }
        getElementsInCart();
        refreshTotalPriceAndQtt();
    }
// wait the page to load
window.addEventListener('load', start);

// get the products in the cart
function getCart() {
    let cart = localStorage.getItem("cart");

    // returns an empty array if the cart is empty or returns the contents of the cart in json
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

// fetch all the elements of the page by their class
function getElementsInCart() {
    const deleteItem = document.querySelectorAll(".deleteItem"),
        changeQtt = document.querySelectorAll(".itemQuantity");

    for (let element of changeQtt) {
        // listen to the quantity change in a loop because multiple items in cart
        element.addEventListener("change", (e) => {
            changeQuantity({
                quantity: parseFloat(e.target.value),
                color: e.target.closest(".cart__item").dataset.color,
                id: e.target.closest(".cart__item").dataset.id,
            });
        });
    }

    for (let element of deleteItem) {
        // listen item deletion in loop because multiple items in cart
        element.addEventListener("click", (e) => {
            // message for user to confirm the deletion
            let isExecuted = confirm("Voulez-vous supprimer cet article du panier ?");
            // if user confirm
            if (isExecuted === true) {
                removeFromCart({
                    color: element.closest(".cart__item").dataset.color,
                    id: element.closest(".cart__item").dataset.id,
                    event: e,
                });
            }
        });
    }
}

// allows to change the quantity of an item
function changeQuantity(product) {
    let cart = getCart(),
        foundProduct = cart.find(p => p.color === product.color, p => p.id === product.id);

    if (foundProduct) {
        foundProduct.quantity = product.quantity;

        if (foundProduct.quantity <= 0) {
            removeFromCart(foundProduct);
        } else {
            saveCart(cart);
            refreshTotalPriceAndQtt();
        }
    }
}

// allows to delete an article
function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter(p => p.color !== product.color, p => p.id !== product.id);
    saveCart(cart);
    refreshTotalPriceAndQtt()
    product.event.target.closest("article").remove();
}

// allows to save the changes in the local Storage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// call the api to get the real price of the product
async function priceProduct(productId) {
    let productPrice;

    await fetch(BASE_URL + productId).then((response) =>
        response.json().then((product) => {
            productPrice = product.price;
        })
    );

    return productPrice;
}

// calculates the total price of the cart and the total number of products
async function refreshTotalPriceAndQtt() {
    let cart = getCart(),
        totalPrice = 0,
        totalQuantity = 0;

    // look in local storage and calculate
    for (let product of cart) {
        totalPrice += product.quantity * await priceProduct(product.id);
        totalQuantity += product.quantity;
    }

    // display result
    document.querySelector("#totalPrice").textContent = totalPrice;
    document.querySelector("#totalQuantity").textContent = totalQuantity;
}

// listen for changes to input fields
form.firstName.addEventListener("change", function () {
    formValidation(form.firstName.value,
        '#' + form.firstName.id + 'ErrorMsg',
        "Prénom",
        /^(?=.{3,40}$)[a-z]+(?:['_.\s][a-z]+)*$/i);
});

// listen for changes to input fields
form.lastName.addEventListener("change", function () {
    formValidation(form.lastName.value,
        '#' + form.lastName.id + 'ErrorMsg',
        "Nom",
        /^(?=.{3,40}$)[a-z]+(?:['_.\s][a-z]+)*$/i);
});

// listen for changes to input fields
form.address.addEventListener("change", function () {
    formValidation(form.address.value,
        '#' + form.address.id + 'ErrorMsg',
        "Adresse",
        /^[a-zA-Z0-9\s,.'-]{3,}$/i);
});

// listen for changes to input fields
form.city.addEventListener("change", function () {
    formValidation(form.city.value,
        '#' + form.city.id + 'ErrorMsg',
        "Ville",
        /^(?=.{3,40}$)[a-z]+(?:['_.\s][a-z]+)*$/i);
});

// listen for changes to input fields
form.email.addEventListener("change", function () {
    formValidation(form.email.value,
        '#' + form.email.id + 'ErrorMsg',
        "Email",
        /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/i);
});

// listen to send of the command
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formValidity) {
        if (productId.length > 0) {
            toOrder();
        } else {
            alert('Votre panier est vide');
        }
    }
});

// checks the validity of the input
function formValidation(textInput, id, text, RegExp) {
    let msgError1 = "Veuillez renseigner votre ",
        msgError2 = " n'est pas valide";

    if (textInput === "") {
        displayMsgError(msgError1 + text, id);
        formValidity = false;

    } else if (!RegExp.test(textInput)) {
        displayMsgError(text + msgError2, id);
        formValidity = false;

    } else {
        displayMsgError("", id);
        formValidity = true;
    }
}

// display error messages under inputs
function displayMsgError(msg, id) {
    document.querySelector(id).textContent = msg;
}

// send the command and the form to the API
function toOrder() {
    // set up data to send
    const contact = {
        contact: {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
        },
         products: productId,
    };
    // send data
    fetch(BASE_URL + 'order', {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: {"Content-Type": "application/json"}
    }).then((blob) =>
        blob.json().then((data) => {
            // API response check
            if (blob.ok) {
                // response good deletion of the basket and redirection with orderId
                localStorage.removeItem("cart");
                window.location.assign("../html/confirmation.html?id=" + data.orderId);
            } else {
                // if error redirect with error code
                window.location.assign("../html/confirmation.html?error=" + blob.status + ' ' + blob.statusText);
            }
        })
    );
}
