const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const jacketId = params.get("id");
const jacketContainer = document.querySelector(".jacket-details");
const jacketName = document.querySelector(".jacketname__h1");
let buyButton;
let checkoutbutton;

async function showProductDetails() {
    jacket = await getProducts(jacketId);
    const averageRating = Math.abs(jacket.average_rating);

    // Generate jackets-html
    let jacketSizes = [];
    jacket.attributes[1].options.forEach((size) => {
        jacketSizes.push(size.toUpperCase());
    });
    let allSizesHTML = "";

    jacketSizes.forEach((size) => {
        allSizesHTML += `
        <input type="radio" name="size" id="size-${size.toLowerCase()}" value="size-${size.toLowerCase()}" hidden="true">
        <label for="size-${size.toLowerCase()}">
            <img src="./images/size-${size.toLowerCase()}.png" class="handcursor" aria-label="Size: ${size}">
        </label>`;
    });
    // Generate gender-html
    let genderMale = `
        <input type="radio" name="gender" id="male" value="male" hidden="true">
        <label for="male" class="gender">
            <p class="required">
                <img src="./images/outline_male_red_24dp.png" class="handcursor">
                <span class="tooltip_top tooltip_gendertop">Male</span>
            </p>
        </label>`;
    let genderFemale = `
        <input type="radio" name="gender" id="female" value="female" hidden="true">
        <label for="female" class="gender">
            <p class="required">
                <img src="./images/outline_female_red_24dp.png" class="handcursor">
                <span class="tooltip_top tooltip_gendertop">Female</span>
            </p>
        </label>`;
    if (jacket.attributes[0].options.length == 1) {
        if (jacket.attributes[0].options[0] == "female") {
            genderMale = "";
        } else {
            genderFemale = "";
        }
    }
    // Generate reviews-html
    const jacketReviews = await getReviews(jacket.id);
    let jacketReviewsHTML = "<i>There are no reviews for this product yet.</i>";
    if (jacketReviews.length > 0) {
        jacketReviewsHTML = "";
        jacketReviews.forEach((review) => {
            jacketReviewsHTML += `
                <img src="./images/${review.rating}-stars.png" aria-label="Rating-stars: ${review.rating}" title="Rating-stars: ${review.rating}">
                <blockquote>${review.review}</blockquote>
                <p class="reviewername">${review.reviewer}</p><hr>`;
        });
    }
    // Generate thumbs-html
    let thumbsHTML = "";
    for (let i = 0; i < jacket.images.length; i++) {
        if (jacket.images.length > 1) {
            let thumbImage = jacket.images[i].src.replace(".jpg", "-150x150.jpg");
            let fullsizeImage = "changeProductImage(`" + jacket.images[i].src.replace(".jpg", "-450x450.jpg") + "`)";
            thumbsHTML += `
            <div>
                <img src="${thumbImage}" alt="${jacket.name}" class="thumbimage" onclick="${fullsizeImage}" onerror="this.style.display='none'"/>
            </div>`;
        }
    }
    // Display the generated html
    jacketContainer.innerHTML = `
    <section class="jacketdetails__images">
        <img src="${jacket.images[0].src.replace(".jpg", "-300x300.jpg")}" alt="${jacket.name}" class="product-image" title="${jacket.name}" onerror="this.style.display='none'"/>
        <div class="product-image_thumbnails">${thumbsHTML}</div>
    </section>
    <section class="jacketdetails__intro_form">
        <h3>${jacket.name}</h3>
        <p class="ratingstars">
            <a href="#jacketdetails_reviews" title="View Reviews">
                <img src="./images/${averageRating}-stars.png" aria-label="Review Stars: ${averageRating}">
            </a>
        </p>
        ${jacket.short_description}
        <p>
            <a href="#jacket_details" alt="Read details for this jacket" title="Read details about this jacket">Read more...</a>
        </p>
        <form action="checkout.html" class="form_orderdetails" onsubmit="return false">
            <fieldset>
                <legend>Select Gender:</legend>
                ${genderFemale}
                ${genderMale}
            </fieldset>
            <fieldset>
                <legend>Select Size:</legend>
                ${allSizesHTML}
            </fieldset>
            <p class="product-specific__price">${jacket.price} NOK</p>
            <input type="hidden" value="${jacketId}" id="id" name="id">
            <button type="submit" class="jacket-cta addtobasket" aria-label="Click to buy now">Add to basket</button>
            <a href="checkout.html" title="Checkout">
                <button type="button" class="jacket-cta checkout" aria-label="Click to buy now">Checkout</button>
            </a>
        </form>
    </section>
    <section class="jacketdetails__details">
        <h2 id="jacket_details">Details</h2>
        <p>${jacket.description}</p>
        <p>
            <a href="#top" alt="Scroll to the top" title="Scroll to the top of page">To the top...</a>
        </p>
    </section>
    <section class="jacketdetails__reviews">
        <h2 id="jacketdetails_reviews">Reviews</h2>
        ${jacketReviewsHTML}
    </section>`;
    // Disabled the buyButton by default. (requires selections)
    buyButton = document.querySelector("button[type=submit].jacket-cta");
    buyButton.disabled = true;
    buyButton.addEventListener("click", addToBasket);
    const selectionForm = document.querySelector(".form_orderdetails");
    selectionForm.addEventListener("change", checkSections);

    // Displays the checkout-button on document load if there are items in the basket.
    checkoutbutton = document.querySelector("button.checkout");
    if (basketCounterContainer.innerHTML == 0) {
        checkoutbutton.style.display = "none";
    }

    // if there is only one gender on this jacket, we select it by default:
    if (jacket.attributes[0].options.length == 1) {
        document.querySelector("input[name=gender]").checked = true;
    }
}

// Retrieve the reviews of the current product:
async function getReviews(id) {
    let getProductReviewUrl = baseUrlCMS + "wc/v3/products/reviews/?product=" + id;
    let reviewArray = [];
    try {
        const result = await fetch(getProductReviewUrl, { method: "GET", headers: headers });
        reviewArray = await result.json();
    } catch (error) {
        document.querySelector(".jacketdetails__reviews").innerHTML = "<h2>Cathing reviews failed. Try reloading the page.</h2>";
    }
    return reviewArray;
}
// Replace the main photo with the chosen thumb.
function changeProductImage(newImg) {
    const mainImageContainer = document.querySelector(".product-image");
    mainImageContainer.src = newImg;
}

showProductDetails();

// define the selected size and gender as they are used in different functions.
let selectedSize;
let selectedGender;

// Checks if both size and gender is selected.
function checkSections() {
    selectedSize = document.querySelector("input[name=size]:checked");
    selectedGender = document.querySelector("input[name=gender]:checked");
    if (selectedSize && selectedGender) {
        buyButton.disabled = false;
    } else {
        buyButton.disabled = true;
    }
}

// Adds item to basket, shows checkout-button, updates basket count, and displays a confirmation of the action to the user.
function addToBasket(event) {
    event.preventDefault(); // Concider to remove this.
    let jacketData = `${jacketId},${selectedSize.value},${selectedGender.value},1`;
    checkoutbutton.style.display = "inline-block";
    addToStorage(jacketData);
    updateBasketItemCount();
    buyButton.innerText = "Item added";
    buyButton.id = "added";
    setTimeout(() => {
        buyButton.id = "";
        buyButton.innerText = "Add to basket";
    }, 1500);
}

// updates the storage with new item.
function addToStorage(str) {
    let currentBasket = [];
    // Check if something is in the basket already:
    if (storage.getItem("Basket")) {
        // convert existing storage-string to an array:
        currentBasket = storage.getItem("Basket").split(";");
        // check if item already exist, returns a boolean (if it exists, the alreadyInBasket-function adds it):
        let duplicateCheckResult = alreadyInBasket(str, currentBasket);
        if (duplicateCheckResult == false) {
            // if item doesn`t already exist we add it.
            currentBasket.push(str);
        }
        // we add the new string including the new item to the basket.
        storage.setItem("Basket", currentBasket.join(";"));
    } else {
        // If this is the first item in the basket, we just write it as it is.
        storage.setItem("Basket", str);
    }
}

// Checks if item is already in basket and updates the number +1 if it exists.
function alreadyInBasket(str, basketArray) {
    // splits the string after the gender, returning the item counter.
    let trimmedSearchString = str.match(/(.*)le/)[0];
    let match;
    for (let i = 0; i < basketArray.length; i++) {
        match = basketArray[i].search(trimmedSearchString);
        if (match >= 0) {
            basketArray = addOrRemoveFromBasket(1, basketArray, i);
            // stop iterating on first match:
            return basketArray;
        }
    }
    return false;
}
