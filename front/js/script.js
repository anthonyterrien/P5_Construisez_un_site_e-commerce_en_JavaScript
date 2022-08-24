BASE_URL = `http://localhost:3000/api/products/`;

// search ID items in the html
let items = document.getElementById('items');

// fill the html page with the data
const start =
    () => {
        // calls the api and receives the data in json
        fetch(BASE_URL).then((response) =>
            response.json().then((data) => {
                for (let product of data) {
                    // introduces the elements in the html
                    items.insertAdjacentHTML('beforeend', `
                    <a href="./product.html?id=${product._id}">
                        <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                            <h3 class="productName">${product.name}</h3>
                            <p class="productDescription">${product.description}</p>
                        </article>
                    </a>`
                    )
                }
            })
        );
    }
// wait the page to load
window.addEventListener('load', start);
