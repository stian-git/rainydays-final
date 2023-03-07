const storage = window.localStorage;
//const baseUrlCMS = "https://tekniskpotet.no/rainydays/";
const baseUrlCMS = "https://www.tekniskpotet.no/rainydays/wp-json/";
//const authConsumerKey = "ck_34ff56c60c7369ee8c203d18f5e4f2179b7d596f";
//const authConsumerSecret = "cs_1cd09593ba430b4a32cac4c96362fd75b24e3e1e";
const loaderIcon = document.querySelector(".fa-spinner");
//console.log("Btoa: " + btoa(authConsumerKey + ":" + authConsumerSecret))
const footerContainer = document.querySelector("footer");

let jacket;

basketCounterContainer = document.querySelector(".basket_items-number");


// TO use JWT:
const apiUser = "apiuser2";
const apiPass = "w4fa 6y3z ekeF Z4bg t6Ug 8tl1";
async function getToken() {
  const getTokenURL = baseUrlCMS + "jwt-auth/v1/token?username=" + apiUser + "&password=" + apiPass;
  try {
      const data = await fetch(getTokenURL, {
          method: "POST",
      });
      const result = await data.json();
      //console.log("Token retrieved: " + result.token);
      storage.setItem("currentToken", result.token);
  } catch (error) {
      // Errors caused by an error here are handled in functions that depend on this one.
      console.log("Error occured fetching the token: " + error);
  }
}

getToken();




// Updates basket item counter:
function updateBasketItemCount() {
    let counter = 0;
    if (storage.getItem("Basket")) {
        let basketArray = storage.getItem("Basket").split(";");
        let currentItemCount;
        basketArray.forEach((item) => {
            currentItemCount = Number(item.match(/\w+$/)[0]);
            counter += currentItemCount;
        });
    }
    basketCounterContainer.innerHTML = counter;
}
updateBasketItemCount();

// Add or removes items from the basket using +/- or add to basket-button.
function addOrRemoveFromBasket(num, arr, arridx) {
    let oldItemData = arr[arridx];
    let oldItemCount = Number(oldItemData.match(/\w+$/)[0]);
    let newItemCount = oldItemCount + num;
    // Makes sure the item count can`t go below 1.
    if (newItemCount == 0) {
        newItemCount = 1;
    }
    let newItemData = oldItemData.replace("," + oldItemCount, "," + newItemCount);
    arr[arridx] = newItemData;
    storage.setItem("Basket", arr.join(";"));
}

let headers = new Headers();
//headers.set("Authorization", "Basic " + btoa(authConsumerKey + ":" + authConsumerSecret));

headers.append("content-type", "application/json");
headers.append("Authorization", "Bearer " + storage.getItem("currentToken"));


async function getProducts(id) {
    let getProductsURL = baseUrlCMS + "wc/v3/products";
    let data;
    if (id) {
        // Used by Jacketdetails page:
        getProductsURL = baseUrlCMS + "wc/v3/products/" + id;
        try {
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            data = await result.json();
        } catch (error) {
            document.querySelector(".jacket-details").innerHTML = "<p>An error occured retrieving the jacket. Please refresh the page to try again.</p>";
        }
    } else {
        try {
            // Used by jackets and checkout page.
            const result = await fetch(getProductsURL, { method: "GET", headers: headers });
            data = await result.json();
            storage.setItem("AllProducts", JSON.stringify(data));
        } catch (error) {
            if (window.location.pathname == "/checkout.html") {
                // Checkout Page:
                document.querySelector("main").innerhtml = "<p>An error occured retrieving the basket details. Please refresh the page to try again.</p>";
            } else {
                // Jackets page.
                document.querySelector(".main__jacketlist").innerHTML = "<p>An error occured retrieving the jackets. Please refresh the page to try again.</p>";
            }
        }
    }
    return data;
}

// banner- carousel
const topBannerContainer = document.querySelector(".banner_container.top");
const bottomBannerContainer = document.querySelector(".banner_container.bottom");

async function getBannerData() {
  let getBannerDataURL = baseUrlCMS + "wc/v3/products/?category=25";
  try {
      const result = await fetch(getBannerDataURL, { method: "GET", headers: headers });
      const data = await result.json();
      return data;
  } catch (error) {
      // No error is displayed because this is not an important element.
  }
}

// async function getBannerData() {
//     let getBannerDataURL = baseUrlCMS + "wp-json/wc/v3/products/?category=25";
//     try {
//         const result = await fetch(getBannerDataURL, { method: "GET", headers: headers });
//         const data = await result.json();
//         return data;
//     } catch (error) {
//         // No error is displayed because this is not an important element.
//     }
// }

let counter = 0;
function displayBanners(productData) {
    const imgArray = ["https://tekniskpotet.no/rainydays/wp-content/uploads/2022/01/jacket-id6.jpg", "https://tekniskpotet.no/rainydays/wp-content/uploads/2022/01/jacket-id2.jpg"];
    const bannerHTML = `
    <a href="jacketdetails.html?id=${productData[0].id}" alt="Banner Image" title="banner image">
        <img src="${productData[0].images[0].src}" class="banner_image" alt="Offer: Banner advertisement for one of our jackets" aria-label="Offer: Banner advertisement for one of our jackets"/>
    </a>
    <a href="jacketdetails.html?id=${productData[0].id}" class="banner_text" title="Jacket banner text">Rainy days - Gets you out of the comfort zone.</a>
    `;
    topBannerContainer.innerHTML = bannerHTML;
    bottomBannerContainer.innerHTML = bannerHTML;
    const myInterval = setInterval(() => {
        if (counter >= productData.length) {
            counter = 0;
            return;
        }
        const prodId = productData[counter].id;
        const prodImg = productData[counter].images[0].src;
        document.querySelector(".banner_container.top .banner_image").src = prodImg;
        document.querySelector(".banner_container.bottom .banner_image").src = prodImg;
        document.querySelector(".banner_container.top .banner_text").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.top a").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.bottom .banner_text").href = "jacketdetails.html?id=" + prodId;
        document.querySelector(".banner_container.bottom a").href = "jacketdetails.html?id=" + prodId;
        counter++;
    }, 10000);
}

// Make sure we retrieve the productData before adding the banner.
getBannerData().then((bannerData) => {
    displayBanners(bannerData);
});

footerContainer.innerHTML = `<ul>
<li>
  <a href="https://www.linkedin.com" target="_blank" aria-label="Our LinkedIn page" title="Our LinkedIn page">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <path
        id="Icon_awesome-linkedin"
        data-name="Icon awesome-linkedin"
        d="M27.857,2.25H2.136A2.152,2.152,0,0,0,0,4.413V30.087A2.152,2.152,0,0,0,2.136,32.25H27.857A2.158,2.158,0,0,0,30,30.087V4.413A2.158,2.158,0,0,0,27.857,2.25ZM9.067,27.964H4.621V13.647H9.074V27.964ZM6.844,11.692A2.578,2.578,0,1,1,9.422,9.114a2.579,2.579,0,0,1-2.578,2.578ZM25.734,27.964H21.288V21c0-1.661-.033-3.8-2.31-3.8-2.317,0-2.672,1.808-2.672,3.676v7.085H11.859V13.647h4.266V15.6h.06a4.683,4.683,0,0,1,4.212-2.31c4.5,0,5.337,2.967,5.337,6.824Z"
        transform="translate(0 -2.25)"
        fill="#d0d9d1"
      />
    </svg>
  </a>
</li>
<li>
  <a href="https://www.instagram.com" target="_blank" aria-label="Our Instagram page" title="Our Instagram page">
    <svg xmlns="http://www.w3.org/2000/svg" width="30.007" height="30" viewBox="0 0 30.007 30">
      <path
        id="Icon_awesome-instagram"
        data-name="Icon awesome-instagram"
        d="M15,9.546a7.692,7.692,0,1,0,7.692,7.692A7.679,7.679,0,0,0,15,9.546Zm0,12.692a5,5,0,1,1,5-5,5.01,5.01,0,0,1-5,5ZM24.8,9.231a1.794,1.794,0,1,1-1.794-1.794A1.79,1.79,0,0,1,24.8,9.231ZM29.9,11.052a8.878,8.878,0,0,0-2.423-6.286,8.937,8.937,0,0,0-6.286-2.423c-2.477-.141-9.9-.141-12.378,0A8.924,8.924,0,0,0,2.523,4.76,8.907,8.907,0,0,0,.1,11.046c-.141,2.477-.141,9.9,0,12.378a8.878,8.878,0,0,0,2.423,6.286,8.948,8.948,0,0,0,6.286,2.423c2.477.141,9.9.141,12.378,0a8.878,8.878,0,0,0,6.286-2.423A8.937,8.937,0,0,0,29.9,23.423c.141-2.477.141-9.894,0-12.371ZM26.7,26.081a5.063,5.063,0,0,1-2.852,2.852c-1.975.783-6.661.6-8.843.6s-6.875.174-8.843-.6a5.063,5.063,0,0,1-2.852-2.852c-.783-1.975-.6-6.661-.6-8.843s-.174-6.875.6-8.843A5.063,5.063,0,0,1,6.158,5.543c1.975-.783,6.661-.6,8.843-.6s6.875-.174,8.843.6A5.063,5.063,0,0,1,26.7,8.395c.783,1.975.6,6.661.6,8.843S27.479,24.113,26.7,26.081Z"
        transform="translate(0.005 -2.238)"
        fill="#d0d9d1"
      />
    </svg>
  </a>
</li>
<li>
  <a href="https://www.facebook.com" target="_blank" aria-label="Our Facebook page" title="Our Facebook page">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <path
        id="Icon_awesome-facebook-square"
        data-name="Icon awesome-facebook-square"
        d="M26.786,2.25H3.214A3.214,3.214,0,0,0,0,5.464V29.036A3.214,3.214,0,0,0,3.214,32.25h9.191v-10.2H8.186v-4.8h4.219V13.591c0-4.162,2.478-6.461,6.273-6.461a25.558,25.558,0,0,1,3.718.324v4.085H20.3a2.4,2.4,0,0,0-2.707,2.594V17.25H22.2l-.737,4.8H17.595v10.2h9.191A3.214,3.214,0,0,0,30,29.036V5.464A3.214,3.214,0,0,0,26.786,2.25Z"
        transform="translate(0 -2.25)"
        fill="#d0d9d1"
      />
    </svg>
  </a>
</li>
<li>
  <a href="https://www.youtube.com" target="_blank" aria-label="Our YouTube page" title="Our YouTube page">
    <svg xmlns="http://www.w3.org/2000/svg" width="39.992" height="30" viewBox="0 0 39.992 30">
      <path
        id="Icon_ionic-logo-youtube"
        data-name="Icon ionic-logo-youtube"
        d="M39.732,11.125a6.073,6.073,0,0,0-5.781-6.343C29.623,4.578,25.21,4.5,20.7,4.5H19.3c-4.5,0-8.921.078-13.249.281C2.859,4.781.273,7.625.273,11.14.078,13.921-.008,16.7,0,19.484q-.012,4.172.266,8.351c0,3.515,2.586,6.367,5.773,6.367,4.547.211,9.21.3,13.952.3q7.125.023,13.952-.3c3.2,0,5.781-2.851,5.781-6.367.187-2.789.273-5.57.266-8.359Q40.013,15.3,39.732,11.125ZM16.171,27.147V11.8L27.5,19.468Z"
        transform="translate(0 -4.5)"
        fill="#d0d9d1"
      />
    </svg>
  </a>
</li>
</ul>
<p>Created by Stian Martinsen - 2022</p>`;
