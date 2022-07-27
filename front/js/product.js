BASE_URL = `http://localhost:3000/api/products/`;

let productColorChoice,
    productPrice,
    productImage,
    productAltTxt,
    productName,
    productDescription;

const start =
    () => {
        // calls the API with the product ID and receives the data in json
        fetch(BASE_URL + searchIdInUrl()).then((response) =>
            response.json().then((product) => {

                for (let color of product.colors) {
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

        // check that there is more than 1 product selected
        if (quantity >= 1) {
                filterBeforeAddCart({
                        "altTxt": productAltTxt,
                        "color": color,
                        "id": id,
                        "imageUrl": productImage,
                        "name": productName,
                        "quantity": parseFloat(quantity)
                });

                // go to cart
                window.location.assign("../html/cart.html");
        } else {
                // no quantity selected
                console.log('no quantity selected');
        }
});

// searches in the URL for the "id=" element and removes the three characters to have just ID
function searchIdInUrl() {
        const url = document.location.href;
        return url.substring(url.lastIndexOf("id=") + 3);
}

// checks if the product already exists in the cart
function filterBeforeAddCart(product) {
        // look at the cart and compare the ID and color with the selected product
        let cart = getCart(),
            foundProduct = cart.find(p => p.color === product.color, p => p.id === product.id),
            quantity = 0;

        // if the product is already in the cart add the quantities
        if (foundProduct) {
                quantity = product.quantity;
                foundProduct.quantity += quantity;
                saveCart(cart);
        } else {
                // or else add product in cart
                addCart(product);
        }
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
