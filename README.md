# Rainy Days

![image](https://tekniskpotet.no/img/rainydays_desktop+mobile.jpg)

A webshop for rain coats.

# Table of Contents

- [Description](#description)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Contact](#contact)

## Description

A webshop for jackets using a backend made of Wordpress with WooCommerce-integration. All product information are administrated in WooCommerce and retrieved through the REST-Api. The basket are stored in the LocalStorage API, and then sent and saved as an order in WooCommerce when the order has been placed.

The webshop even handles product variations (gender and sizes) for each product, and it also hides options that are not available for the individual products.

- Wordpress API-Integration
- WooCommerce API
- Place order in backend
- Search and filter Products
- Display multiple product photos from thumbs
- Basket stored in LocalStorage API
- Live Calculations

## Built With

This project was built using:

- [Wordpress](https://wordpress.org/)
- [WooCommerce](https://woocommerce.com/)
- [FontAwesome](https://fontawesome.com/)

## Getting Started

You need your own Wordpress-installation to use this with the following plugins:

- [JWT Authentication for WP-API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
- [Headless Mode](https://wordpress.org/plugins/headless-mode/)
- [WooCommerce](https://wordpress.org/plugins/woocommerce/)

This site is hosted on the following url for testing purposes:
[https://fascinating-babka-fe7c7e.netlify.app/](https://fascinating-babka-fe7c7e.netlify.app/)

### Installing

1. Clone the repo:

```bash
git clone stian-git/rainydays-final
```

2. Configuration:

In js/common.js you should change the baseUrlCMS-, apiUser- and apiPass-variables to make it work with your own Wordpress.

## Contributing

This was made for a school project so I'm not planning for regular maintenance, but rather use it to show some of my work.
However I will welcome feedback, suggestions and ideas. Please reach me through the contact information below.

## Contact

The best way to reach me would be through the following sites:

[My Portfolio](https://tekniskpotet.no)

[My LinkedIn page](https://www.linkedin.com/in/stian-martinsen-stormyr-1662a515/)
