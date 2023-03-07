// Fields to display basket data:
const basketItemContainer = document.querySelector("table");
const basketSummaryContainer = document.querySelector(".basket__summary");
const basketHeader = document.querySelector(".basket h2");
const shipmentPriceContainer = document.querySelector(".shipmentprice");
const invoiceFeeContainer = document.querySelector(".invoicefee");
const totalPriceContainer = document.querySelector(".totalprice");

// Open terms
function openTerms() {
    window.open("./terms.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,fullscreen=yes");
}

// Fixed prices for fees in basket
let shipment = 7;
let invoiceFee = 2;

// Collect items from the basket and prepare the data to be displayed.
function getJacketsInBasket(allJackets) {
    let totalPrice = 0;
    basketItemContainer.innerHTML = `
    <tr class="rowheader">
        <td class="name basket_headertext">Name</td>
        <td class="basket_headertext">Qty</td>
        <td class="basket_headertext">Price (per)</td>
        <td class="basket_headertext">Delete</td>
    </tr>`;
    // Handle cases where basket is empty:
    basketItemContainer.style.display = "none";
    basketSummaryContainer.style.display = "none";
    basketHeader.innerHTML = "Basket is currently empty. Please add products to the basket first.";
    loaderIcon.style.display = "none";
    // When the basket is not empty:
    if (!storage.getItem("Basket") == "") {
        checkOutForm.style.display = "grid";
        basketItemContainer.style.display = "table";
        basketSummaryContainer.style.display = "grid";
        basketHeader.innerHTML = "Basket";
        const basketArray = storage.getItem("Basket").split(";");
        basketArray.forEach((item, i) => {
            const itemId = item.match(/^\w+/)[0];
            const currentJacketData = allJackets.filter((jacket) => jacket.id == itemId);
            const itemPrice = Number(currentJacketData[0].price).toFixed(2);
            const itemName = currentJacketData[0].name;
            const itemThumb = currentJacketData[0].images[0].src.replace(".jpg", "-150x150.jpg");
            const itemSize = item.split(",")[1].split("-")[1].toUpperCase();
            const itemGender = item.split(",")[2];
            const itemCount = item.split(",")[3];
            totalPrice += currentJacketData[0].price * itemCount;
            const dataToDisplayInBasket = {
                basketArrayIndex: i,
                name: itemName,
                size: itemSize,
                qty: itemCount,
                img: itemThumb,
                price: itemPrice,
                gender: itemGender,
            };
            // Then displays the collected item:
            displayBasketItem(dataToDisplayInBasket);
        });
    }
    // Updates the price:
    shipmentPriceContainer.innerHTML = shipment.toFixed(2);
    invoiceFeeContainer.innerHTML = invoiceFee.toFixed(2);
    totalPriceContainer.innerHTML = (totalPrice + shipment + invoiceFee).toFixed(2);
}

// Adds each item to the basket. (populated from GetJacketsInBasket)
function displayBasketItem(item) {
    const basketItemContainer = document.querySelector("tbody");
    let genderImage;
    let genderText = item.gender.charAt(0).toUpperCase() + item.gender.slice(1);
    if (item.gender == "female") {
        genderImage = "./images/outline_female_red_24dp.png";
    } else {
        genderImage = "./images/outline_male_red_24dp.png";
    }
    let sizeImage;
    let sizeText;
    switch (item.size) {
        case "S":
            sizeImage = "./images/size-s.png";
            sizeText = "Small";
            break;
        case "M":
            sizeImage = "./images/size-m.png";
            sizeText = "Medium";
            break;
        case "L":
            sizeImage = "./images/size-l.png";
            sizeText = "Large";
            break;
        case "XL":
            sizeImage = "./images/size-xl.png";
            sizeText = "X-Large";
            break;
        case "XXL":
            sizeImage = "./images/size-xxl.png";
            sizeText = "2X-Large";
            break;

        default:
            break;
    }
    const itemHTML = `
    <tr>
        <td class="name">
            <img src="${item.img}" class="basket_productimage" />
            <p class="required">
                <img src="${sizeImage}" class="basket_navbutton" />
                <img src="${genderImage}" class="basket_navbutton" />
                <span class="tooltip_top">${sizeText}, ${genderText}</span>
            </p>
            <p class="basket_productname">${item.name}</p>
        </td>
        <td>
            <img src="./images/MinusButton.png" class="basket_navbutton subtractbutton arrId-${item.basketArrayIndex}" aria-label="Subtract 1" title="Subtract 1" />  
            <p class="basket_qty" aria-label="Current quantity">${item.qty}</p>
            <img src="./images/PlusButton.png" class="basket_navbutton addbutton arrId-${item.basketArrayIndex}" aria-label="Add 1" title="Add 1" />  
        </td>
        <td>${item.price}</td>
        <td>
            <img src="./images/X-Button.png" class="basket_navbutton deletebutton arrId-${item.basketArrayIndex}" aria-label="Delete-button" title="Delete" />
        </td>
    </tr>`;
    basketItemContainer.innerHTML += itemHTML;
}

// Removes item from basket when the delete-button is triggered.
function deleteItem(event) {
    // Identify which item to delete:
    const arrIndexToDelete = event.target.classList.value.split("-")[1];
    const basketArray = storage.getItem("Basket").split(";");
    basketArray.splice(arrIndexToDelete, 1);
    storage.setItem("Basket", basketArray.join(";"));
    reloadAndKeepFormData();
}

// function to increase an item (+ button)
function increaseItem(event) {
    const arrIndexToAdd = event.target.classList.value.split("-")[1];
    const arr = storage.getItem("Basket").split(";");
    addOrRemoveFromBasket(1, arr, Number(arrIndexToAdd));
    reloadAndKeepFormData();
}
// function to increase an item (- button)
function subtractItem(event) {
    const arrIndexToSubtract = event.target.classList.value.split("-")[1];
    const arr = storage.getItem("Basket").split(";");
    addOrRemoveFromBasket(-1, arr, Number(arrIndexToSubtract));
    reloadAndKeepFormData();
}

async function getProductData() {
    const jacketData = await getProducts();
    getJacketsInBasket(jacketData);

    // The below eventlisteners are defined here because they are not in the DOM before the above step:
    const addButtons = document.querySelectorAll(".addbutton");
    const subtractButtons = document.querySelectorAll(".subtractbutton");
    const deleteButtons = document.querySelectorAll(".deletebutton");

    addButtons.forEach((addElement) => {
        addElement.addEventListener("click", increaseItem);
    });
    subtractButtons.forEach((subtractElement) => {
        subtractElement.addEventListener("click", subtractItem);
    });
    deleteButtons.forEach((element) => {
        element.addEventListener("click", deleteItem);
    });
}

getProductData();
