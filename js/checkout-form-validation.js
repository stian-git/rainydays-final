const checkOutForm = document.querySelector(".checkoutDetails");
const fullName = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const addressLine1 = document.querySelector("#address1");
const addressLine2 = document.querySelector("#address2");
const zip = document.querySelector("#zip");
const city = document.querySelector("#city");
const country = document.querySelector("#country");
const termsCheckbox = document.querySelector("#terms");

// Hides the checkout form by default to avoid people typing in form details before any products are in the basket.
checkOutForm.style.display = "none";

// Disables the submit-button by default.
const submitButton = document.querySelector("button[type=submit].jacket-cta");
submitButton.disabled = true;

// Stores form data to storage when page is refreshed while interacting with the basket.
function reloadAndKeepFormData() {
    let customerName = fullName.value;
    let customerMail = email.value;
    let customerPhone = phone.value;
    let customerAddress1 = addressLine1.value;
    let customerAddress2 = addressLine2.value;
    let customerZip = zip.value;
    let customerCity = city.value;
    let customerCountry = country.value;
    let isTermsChecked = termsCheckbox.checked;
    storage.setItem("Name", customerName);
    storage.setItem("Mail", customerMail);
    storage.setItem("Phone", customerPhone);
    storage.setItem("Address1", customerAddress1);
    storage.setItem("Address2", customerAddress2);
    storage.setItem("Zip", customerZip);
    storage.setItem("City", customerCity);
    storage.setItem("Country", customerCountry);
    storage.setItem("Terms", isTermsChecked);
    storage.setItem("isReloaded", true);
    location.reload();
}

// on page-load we check if form data is already stored and retrieves them again.
function checkForReload() {
    if (storage.getItem("isReloaded") == "true") {
        fullName.value = storage.getItem("Name");
        email.value = storage.getItem("Mail");
        phone.value = storage.getItem("Phone");
        addressLine1.value = storage.getItem("Address1");
        addressLine2.value = storage.getItem("Address2");
        zip.value = storage.getItem("Zip");
        city.value = storage.getItem("City");
        country.value = storage.getItem("Country");
        if (storage.getItem("Terms") == "true") {
            termsCheckbox.checked = true;
        } else {
            termsCheckbox.checked = false;
        }
        storage.setItem("isReloaded", false);
        //Force a recheck of validations to enable/disable the "Place order"-button
        reValidateUnemptyFields();
    }
}
checkForReload();

// Recheck all validations.
function reValidateUnemptyFields() {
    if (fullName.value) {
        validateName();
    }
    if (email.value) {
        validateEmailAddress();
    }
    if (addressLine1.value) {
        validateAddress1();
    }
    if (zip.value) {
        validateZip();
    }
    if (city.value) {
        validateCity();
    }
    if (country.value) {
        validateCountry();
    }
    checkAllFields();
}

// Common functions
function validateEmail(email) {
    const regEx = /\S+@\S+\.\S+/;
    const patternMatches = regEx.test(email);
    return patternMatches;
}

function lengthCheck(string, length) {
    if (string.trim().length >= length) {
        return true;
    } else {
        return false;
    }
}

function textOnlyCheck(string) {
    const regEx = /^[a-zA-ZæøåÆØÅ]+(([',. -][a-zA-ZæøåÆØÅ ])?[a-zA-ZæøåÆØÅ]*)*$/;
    const textOnly = regEx.test(string);
    return textOnly;
}

// Enables and toggles the icon that indicates if a field is ok or not.

function toggleValidation(field, status) {
    field.style.display = "inline-flex";
    if (status === true) {
        field.classList.remove("fa-exclamation-circle");
        field.classList.add("fa-check-circle");
        checkAllFields();
    } else {
        field.classList.remove("fa-check-circle");
        field.classList.add("fa-exclamation-circle");
        submitButton.disabled = true;
    }
}

// Validations:

// Validate name:

function validateName(event) {
    const validationField = document.querySelector(".name .fas");
    const helptext = document.querySelector("label[for=name] .helptext");
    const nameLength = 3;
    if (!lengthCheck(fullName.value.trim(), nameLength) || !textOnlyCheck(fullName.value.trim())) {
        fullName.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Only letters. Minimum ${nameLength} characters.`;
    } else {
        fullName.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

fullName.addEventListener("input", validateName);

// Validate email address:
function validateEmailAddress(event) {
    const validationField = document.querySelector(".email .fas");
    const helptext = document.querySelector("label[for=email] .helptext");
    if (!validateEmail(email.value)) {
        email.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = "Email address looks invalid";
    } else {
        email.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

email.addEventListener("input", validateEmailAddress);

// Validate address line 1 field:
function validateAddress1(event) {
    const validationField = document.querySelector(".address1 .fas");
    const helptext = document.querySelector("label[for=address1] .helptext");
    const address1Length = 3;
    if (!lengthCheck(addressLine1.value, address1Length)) {
        addressLine1.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Minium ${address1Length} characters needed.`;
    } else {
        addressLine1.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

addressLine1.addEventListener("input", validateAddress1);

// No validation on address line 2:
// addressLine2.addEventListener("blur", validateAddress2);

// Validate Zip:
function validateZip(event) {
    const validationField = document.querySelector(".zip .fas");
    const helptext = document.querySelector("label[for=zip] .helptext");
    const zipLength = 3;
    if (!lengthCheck(zip.value, zipLength)) {
        zip.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Minium ${zipLength} characters needed.`;
    } else {
        zip.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

zip.addEventListener("input", validateZip);

// Validate City:
function validateCity(event) {
    const validationField = document.querySelector(".city .fas");
    const helptext = document.querySelector("label[for=city] .helptext");
    const cityLength = 3;
    if (!lengthCheck(city.value.trim(), cityLength) || !textOnlyCheck(city.value.trim())) {
        city.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = `Only letters. Minimum ${cityLength} characters.`;
    } else {
        city.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

city.addEventListener("input", validateCity);

// Validate Country:
function validateCountry(event) {
    const validationField = document.querySelector(".country .fas");
    const helptext = document.querySelector("label[for=country] .helptext");
    if (country.value === "") {
        country.classList.add("validationerror");
        toggleValidation(validationField, false);
        helptext.style.display = "block";
        helptext.innerHTML = "Please select a country.";
    } else {
        country.classList.remove("validationerror");
        toggleValidation(validationField, true);
        helptext.style.display = "none";
    }
}

country.addEventListener("change", validateCountry);
country.addEventListener("blur", validateCountry);

// Validate terms:

function validateTerms(event) {
    const helptext = document.querySelector(".placeorder_container .helptext");
    if (!termsCheckbox.checked) {
        helptext.style.display = "block";
        helptext.innerHTML = "Please accept terms to place order.";
        submitButton.disabled = true;
    } else {
        helptext.style.display = "none";
    }
}

termsCheckbox.addEventListener("click", validateTerms);

// CHECK all validations and enable submit-button
function checkAllFields() {
    // NB: Currently missing additional check for Payment method as there are only one option.
    const validationCorrectCount = document.querySelectorAll(".fa-check-circle").length;
    if (validationCorrectCount === 6) {
        if (!termsCheckbox.checked || basketCounterContainer.innerHTML == 0) {
            validateTerms();
            return;
        }
        submitButton.disabled = false;
        submitButton.classList.add("handcursor");
    } else {
        submitButton.disabled = true;
        submitButton.classList.remove("handcursor");
    }
}
checkOutForm.addEventListener("change", checkAllFields);

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    sendOrder();
})