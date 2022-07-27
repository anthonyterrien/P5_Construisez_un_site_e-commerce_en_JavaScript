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
window.addEventListener('load', start)

// searches in the URL for the "id=" element and removes the three characters to have just ID
function searchIdInUrl() {
        const url = document.location.href;
        return url.substring(url.lastIndexOf("id=") + 3);
}
