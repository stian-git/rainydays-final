async function getProductId(basketItem) {
    const itemAttributes = basketItem.split(",");
    const itemSku = itemAttributes[0] + "_" + itemAttributes[2] + "_" + itemAttributes[1].replace("size-","");
    const itemParentId = itemAttributes[0];
    const findVariationsUrl = baseUrlCMS + "wc/v3/products/" + itemParentId + "/variations/?sku=" + itemSku;
    try {
        const data = await fetch(findVariationsUrl, {
            headers: headers,
        });
        const result = await data.json();
        return result[0].id;
    } catch (error) {
        console.log("An error occured fetching the variations ID for basket item(" + basketItem + "): " + error)
    }
}

async function placeOrder(orderdetails) {
    const addOrderURL = baseUrlCMS + "wc/v3/orders/";
    try {
        const data = await fetch(addOrderURL, {
            method: "post",
            headers: headers,
            body: orderdetails,
        }).then((response) => {
            if (response.ok === true) {
                response.json().then((result) => {
                    //Need to fetch the order number, before forwarding the user:
                    window.location.href = "checkout-success.html?name=" + fullName.value + "&email=" + email.value + "&order=" + result.number;
                });
            } else {
                switch (response.status) {
                    case 400:
                        console.log("400-error. Possible wrong JSON-format.")
                        break;
                
                    default:
                        console.log("Unhandled error occoured: " + response.status);
                        break;
                }
            }
        });
    } catch (error) {
        console.log("An error occured posting the order: " + error);
    }
}


async function newOrder() {
    const basketString = storage.getItem("Basket");
    const basketArray = basketString.split(";");
    let orderlines = `"line_items":[`;
    for (i = 0; i < basketArray.length; i++) {
        let currentItemID = await getProductId(basketArray[i]);
        orderlines += `{"product_id":${currentItemID},"quantity":${Number(basketArray[i].split(",")[3])}}`;
        if (i < basketArray.length -1) {
            // Only adds comma if it`s not the last item.
            orderlines += ",";
        }
    }
    return orderlines;
}

function sendOrder() {
    newOrder().then((lines) => {
        const last_name = fullName.value.split(" ")[fullName.value.split(" ").length -1];
        const first_name = fullName.value.replace(last_name,"");
        const preString = `{"total":0,"billing":{"first_name":"${first_name}","last_name":"${last_name}","address_1":"${addressLine1.value}","address_2":"${addressLine2.value}","city":"${city.value}","postcode":"${zip.value}","country":"${country.value}","email":"${email.value}","phone":"${phone.value}"},`;
        const postString = `]}`;
        const newString = preString + lines + postString;
        placeOrder(newString);
    });
}