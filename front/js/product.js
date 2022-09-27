BASE_URL = `http://localhost:3000/api/products/`;

let productColorChoice,
    productPrice,
    productImage,
    productAltTxt,
    productName,
    productDescription;

// fill the html page with the data
const start =
    () => {
        // calls the API with the product ID and receives the data in json
        fetch(BASE_URL + searchIdInUrl()).then((response) =>
            response.json().then((product) => {

                for (let color of product.colors) {
                        // introduces the elements in the html
                    productColorChoice += `<option value="${color}">${color}</option>`;
                }

                productPrice = product.price;
                productImage = product.imageUrl;
                productAltTxt = product.altTxt;
                productName = product.name;
                productDescription = product.description;

                // searches in html the ID and class to replace them with their contents
                document.querySelector("#colors").innerHTML = productColorChoice;
                document.querySelector(".item__img").innerHTML = `<img src="${productImage}" alt="${productAltTxt}">`;

                document.querySelector("#title").textContent = productName;
                document.querySelector("#price").textContent = productPrice;
                document.querySelector("#description").textContent = productDescription;
                document.querySelector("title").textContent = productName;
            })
        );
    }
// wait the page to load
window.addEventListener('load', start);

// listen when there is an addition to cart
document.getElementById("addToCart").addEventListener("click", function () {

        // look at the quantity and color selected and get the ID
        const quantity = document.getElementById("quantity").value,
            color = document.getElementById("colors").value,
            id = searchIdInUrl();

        // send data to filter
        filterBeforeAddCart({
            "altTxt": productAltTxt,
            "color": color,
            "id": id,
            "imageUrl": productImage,
            "name": productName,
            "quantity": parseFloat(quantity)
    });
});

// searches in the URL for the "id=" element and removes the three characters to have just ID
function searchIdInUrl() {
        const url = document.location.href;
        return url.substring(url.lastIndexOf("id=") + 3);
}

// filter before saving data
function filterBeforeAddCart(product) {
    // check that there is more than 1 product selected
    if (product.quantity >= 1) {
        // check that there are no more than one hundred products selected
        if (product.quantity < 101) {
            // look at the cart and compare the ID and color with the selected product
            let cart = getCart(),
                foundProduct = cart.find(p => p.color === product.color, p => p.id === product.id),
                quantity = 0;
            // if the product is already in the cart add the quantities
            if (foundProduct) {
                quantity = product.quantity;
                // check the sum of two does not exceed hundred products
                if ((foundProduct.quantity + quantity) < 101) {
                    displayMsgError('')
                    foundProduct.quantity += quantity;
                    saveCart(cart);
                    afterSaveOrAddCart();
                } else {
                    // send the error message
                    displayMsgError('Vous ne pouvez pas ajouter plus de 100 article de ce modèle.');
                }
            } else {
                // or else add product in cart
                displayMsgError('')
                addCart(product);
                afterSaveOrAddCart();
            }
        } else {
            // displays an error message
            displayMsgError('Vous ne pouvez pas ajouter ' + product.quantity + ' article de ce modèle.');
        }
    } else {
        // displays an error message
        displayMsgError('Vous devez sélèctionner au moin un article.');
    }
}

// ask if you want to go to the cart
function afterSaveOrAddCart() {
    let isExecuted = confirm("Voulez-vous voir votre panier ?");
    // if user confirm
    if (isExecuted === true) {
        window.location.assign("../html/cart.html");
    } else {
        // alert the user that the product has been added
        alert("Votre article a bien été ajouté au panier")
    }
}

// format and displays an error message
function displayMsgError(msgError) {
    document.querySelector(".item__content__settings__quantity").innerHTML
        = `<label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
           <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
           <span style="color: #fbbcbc; display: flex" >${msgError}</span>`;
}

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

// add products to cart
function addCart(product) {
        let cart = getCart();
        cart.push(product);
        saveCart(cart);
}

// save the cart to local storage
function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
}
