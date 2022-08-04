searchInUrl()

// search in URL if the order is validated
function searchInUrl() {
    let errorOrId;
    const url = document.location.href;
    // search id in url
    errorOrId = url.substring(url.lastIndexOf(".html?") + 6).substr(0, 2)

    if ( errorOrId === 'id') {
        // if the order has been validated displays orderId
        document.querySelector("#orderId").textContent = url.substring(url.lastIndexOf("id=") + 3);

    } else {
        // if the command is not validated change the message
        document.querySelector("#orderId").closest("p").innerHTML =
            'Votre commande n\'a pas été validé <br> Une erreur s\'est produite : <span id="orderId"></span>';

        // and displays the error code
        document.querySelector("#orderId").textContent =
            decodeURI(url.substring(url.lastIndexOf("error=") + 6));

        // and change the title of the page
        document.querySelector("title").textContent = 'erreur';
    }
}
