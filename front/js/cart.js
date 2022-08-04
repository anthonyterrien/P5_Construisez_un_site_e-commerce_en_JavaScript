BASE_URL = `http://localhost:3000/api/products/`;

// search ID cart__items in the html
let items = document.getElementById('cart__items');

const start =
    () => {
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
                   <p>${product.price}</p>
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
        }
        getElementsInCart();
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
        }
    }
}

// allows to delete an article
function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter(p => p.color !== product.color, p => p.id !== product.id);
    saveCart(cart);
    product.event.target.closest("article").remove();
}

// allows to save the changes in the local Storage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
