// Make sure we clear the storage when order has been placed:
storage.clear();
updateBasketItemCount();

// Retrieve parameters from URL:

const queries = document.location.search;
const params = new URLSearchParams(queries);

const customerName = params.get("name");
const customerEmail = params.get("email");
const orderNumber = params.get("order");
//const orderNumber = 123456;

/* Displays the checkout confirmation message using the above variables */

const checkout_textContainer = document.querySelector(".checkout__main");

checkout_textContainer.innerHTML = `<p>Thank you for placing your order, <i>${customerName}</i>. (order number: ${orderNumber}).</p>
<p>We have successfully received your order and an order confirmation will be sent to <i>${customerEmail}</i> shortly.</p>
<p>To trace the status of you order, please follow the instructions from the order confirmation.</p>
<p class="checkout_punchline">Pushing the comfort zone.</p>
`;
