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
