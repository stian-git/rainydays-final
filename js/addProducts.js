const searchQuery = document.location.search;
const searchParams = new URLSearchParams(searchQuery);
const searchString = searchParams.get("q"); // q = search query.

const searchField = document.querySelector("input[type=search]");
const searchButton = document.querySelector(".aside__search-field button");
const jacketsContainer = document.querySelector(".main__jacketlist");
const productFilter = document.querySelector(".filter-container form");

function showJackets(jackets, filterUse = false) {
    /* if a search query is found in the header, then display the search result instead of all*/
    if (searchString && filterUse == false) {
        searchField.value = searchString;
        jackets = searchProducts(searchString);
        searchString.value = null;
    }
    jacketsContainer.innerHTML = "";
    // If there are no jackets to display:
    if (jackets.length == 0) {
        jacketsContainer.innerHTML = `<div class="error nojacketstoshow">
                                        <p>0 jackets are currently matching your search and/or filter.</p>
                                        <p>Please modify your filter or clear the search field to resume</>
                                    </div>`;
    }
    // Generate HTML elements per product and displays them.
    for (let i = 0; i < jackets.length; i++) {
        let productLink = `<p class="jacket-cta" title="${jackets[i].name}">View</p>`;
        let bestbuyIcon = ``;
        let maleIcon = ``;
        let femaleIcon = ``;
        // Adds the BestBuy-icon.
        if (jackets[i].featured === true) {
            productLink = `<p class="jacket-cta jacketsale" title="${jackets[i].name}">On Sale</p>`;
            bestbuyIcon = `
            <svg id="BestBuy-Mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 78" aria-label="Best buy badge">
                <g id="Polygon_1" data-name="Polygon 1" fill="#0a3641">
                    <path d="M 53.22784805297852 76.64013671875 L 41.46365737915039 70.48397827148438 L 41 70.24135589599609 L 40.53635406494141 70.48397827148438 L 28.77214431762695 76.64012908935547 L 22.87254524230957 64.74359893798828 L 22.64007759094238 64.27484130859375 L 22.12243270874023 64.19855499267578 L 8.986950874328613 62.26295852661133 L 11.20552253723145 49.16994476318359 L 11.2929220199585 48.65416717529297 L 10.91906642913818 48.28823471069336 L 1.429614782333374 38.9999885559082 L 10.91906642913818 29.71175575256348 L 11.2929220199585 29.34583282470703 L 11.20552253723145 28.83004379272461 L 8.986970901489258 15.73703002929688 L 22.12244415283203 13.80143356323242 L 22.64008903503418 13.7251443862915 L 22.87255477905273 13.25638866424561 L 28.77217292785645 1.359864592552185 L 40.536376953125 7.516033172607422 L 41.00003433227539 7.758655548095703 L 41.46368789672852 7.516033172607422 L 53.22784805297852 1.359876394271851 L 59.12746810913086 13.2564001083374 L 59.35993194580078 13.7251558303833 L 59.87757873535156 13.80143356323242 L 73.01303863525391 15.73704051971436 L 70.79447937011719 28.83005523681641 L 70.70707702636719 29.34583282470703 L 71.0809326171875 29.71176719665527 L 80.57038116455078 39 L 71.0809326171875 48.28823471069336 L 70.70707702636719 48.65416717529297 L 70.79447937011719 49.16994476318359 L 73.01303863525391 62.26295852661133 L 59.87757873535156 64.19855499267578 L 59.35993194580078 64.27484130859375 L 59.12746810913086 64.74359893798828 L 53.22784805297852 76.64013671875 Z" stroke="none"/>
                    <path d="M 29.21401977539063 2.719718933105469 L 23.76843643188477 13.70067596435547 L 23.30351257324219 14.63818740844727 L 22.26822662353516 14.79074859619141 L 10.14360809326172 16.57738494873047 L 12.19145965576172 28.66298675537109 L 12.36626434326172 29.69454956054688 L 11.61855316162109 30.42639923095703 L 2.859222412109375 38.9999885559082 L 11.61855316162109 47.57358551025391 L 12.36626434326172 48.30543518066406 L 12.19145965576172 49.33699798583984 L 10.14360046386719 61.42259979248047 L 22.26821136474609 63.20923614501953 L 23.30350112915039 63.36180114746094 L 23.76842498779297 64.29931640625 L 29.21398544311523 75.28026580810547 L 40.07270050048828 69.59794616699219 L 41 69.11270141601563 L 41.92729949951172 69.59794616699219 L 52.78600311279297 75.28028106689453 L 58.23157501220703 64.29931640625 L 58.69650268554688 63.36180114746094 L 59.73178863525391 63.20923614501953 L 71.85639190673828 61.42259979248047 L 69.80854034423828 49.33699798583984 L 69.63373565673828 48.30543518066406 L 70.38144683837891 47.57358551025391 L 79.14077758789063 39 L 70.38144683837891 30.42641067504883 L 69.63373565673828 29.69456100463867 L 69.80854034423828 28.66299819946289 L 71.85639190673828 16.57740783691406 L 59.73178863525391 14.79076385498047 L 58.69650268554688 14.63819885253906 L 58.23157501220703 13.70069122314453 L 52.78600311279297 2.719718933105469 L 41.92732620239258 8.402046203613281 L 41.00002670288086 8.887298583984375 L 40.07272338867188 8.402046203613281 L 29.21401977539063 2.719718933105469 M 28.33033752441406 0 L 41.00002670288086 6.630012512207031 L 53.66968536376953 0 L 60.02334976196289 12.81212615966797 L 74.16968536376953 14.89668655395508 L 71.78042602539063 28.99712371826172 L 82 39 L 71.78042602539063 49.00287628173828 L 74.16968536376953 63.10332489013672 L 60.02334976196289 65.18787384033203 L 53.66968536376953 78 L 41 71.36998748779297 L 28.33029937744141 77.99998474121094 L 21.97665023803711 65.18787384033203 L 7.830299377441406 63.10332489013672 L 10.21957397460938 49.00287628173828 L 0 38.9999885559082 L 10.21957397460938 28.99711227416992 L 7.830314636230469 14.89666366577148 L 21.97666168212891 12.81211090087891 L 28.33033752441406 0 Z" stroke="none" fill="#d0d9d1"/>
                </g>
                <text id="Best_buy_" data-name="Best buy!" transform="translate(14 46)" fill="#d0d9d1" font-size="16" font-family="Oswald"><tspan x="0" y="0">Best buy!</tspan></text>
            </svg>`;
        }
        // Genders
        let prodGenderMale = true;
        let prodGenderFemale = true;
        if (jackets[i].attributes[0].options.length == 1) {
            if (jackets[i].attributes[0].options[0] == "female") {
                prodGenderMale = false;
            } else {
                prodGenderFemale = false;
            }
        }
        if (prodGenderMale === true) {
            maleIcon = `
                  <i class="required gender">
                    <img src="./images/outline_male_black_24dp.png" aria-label="Male Icon">
                    <span class="tooltip_top gender">Male</span>
                  </i>`;
        }
        if (prodGenderFemale === true) {
            femaleIcon = `
                <i class="required gender">
                  <img src="./images/outline_female_black_24dp.png" aria-label="Female Icon">
                  <span class="tooltip_top gender">Female</span>
                </i>`;
        }
        // Display each jacket in their own container:
        jacketsContainer.innerHTML += `
            <a href="jacketdetails.html?id=${jackets[i].id}">
                <div class="jacketcontainer">
                    <div class="image_container">
                        <img src="${jackets[i].images[0].src.replace(".jpg", "-300x300.jpg")}" alt="${jackets[i].name}" aria-label="Jacket name: ${jackets[i].name}"/>
                        ${bestbuyIcon}
                    </div>
                    <div class="jacket_info">
                        <h2>${jackets[i].name}</h2>
                        <p class="jacketprice">${jackets[i].price} NOK</p>
                        <p class="jacketgender">${femaleIcon} ${maleIcon}</p>
                        ${productLink}
                    </div>
                </div>
            </a>`;
    }
    loaderIcon.style.display = "none";
}

// disable the searchbutton to avoid resetting filters. (search field got another event)
searchButton.onclick = function (event) {
    event.preventDefault();
};

/* search product name and filters the result and then displays the result*/
function searchProducts(str) {
    let arr = JSON.parse(storage.getItem("AllProducts"));
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name.toLocaleLowerCase().search(str.toLocaleLowerCase()) >= 0) {
            result.push(arr[i]);
        }
    }
    return result;
}
// update visible products when filters are enabled.
function updateProductWithFilters() {
    currentJacketArray = JSON.parse(storage.getItem("AllProducts"));
    if (!searchField.value == "") {
        currentJacketArray = searchProducts(searchField.value);
    }
    let selectedGender = document.querySelector("input[name=gender]:checked").value;
    if (selectedGender != "both") {
        currentJacketArray = genderFilter(selectedGender, currentJacketArray);
    }
    let sizes = [];
    const sizeBoxes = document.querySelectorAll(".filter-container input[type=checkbox]");
    sizeBoxes.forEach((size) => {
        if (size.checked) {
            sizes.push(size.value);
        }
    });
    if (sizes.length != 0) {
        currentJacketArray = sizeFilter(sizes, currentJacketArray);
    }
    showJackets(currentJacketArray, true);
}

searchField.addEventListener("keyup", updateProductWithFilters);
productFilter.addEventListener("change", updateProductWithFilters);

/* returns an array with only jackets matching the gender filter */
function genderFilter(gender, arr) {
    let result = [];
    if (gender == "male") {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].attributes[0].options[0] == "male" || arr[i].attributes[0].options[1] == "male") {
                result.push(arr[i]);
            }
        }
    } else {
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].attributes[0].options[0] == "female" || arr[j].attributes[0].options[1] == "female") {
                result.push(arr[j]);
            }
        }
    }
    return result;
}

/* returns an array with only the jackets matching the chosen sizes  */

function sizeFilter(sizes, arr) {
    let result = [];
    arr.forEach((element) => {
        // Adds - to create a unique syntax.
        let sizeString = "-" + element.attributes[1].options.join("-") + "-";
        for (let k = 0; k < sizes.length; k++) {
            let sizeMatch = sizeString.search("-" + sizes[k].toLocaleLowerCase() + "-");
            if (sizeMatch >= 0) {
                result.push(element);
                break;
            }
        }
    });

    return result;
}

// Make sure we retrieve the data from the API before we attempt to display them.
getProducts().then((allJackets) => {
    showJackets(allJackets);
});
