BAR Backend
===========

This is the backend part of the BAR app.

To see the project proposal, see [Here](docs/proposal.md)

To see the design documentation, see [Here](docs/design.md)


# Building
## Initializing the data base.
See [Here](docs/createdb.md)

## Configure .env

Make a copy of ```.env.example``` and name it ```.env```, change the ```.env``` file according to your configurations.

## Configure reCAPTCHA

Generate your site-key and secret-key at https://www.google.com/recaptcha/admin/create using reCAPTCHA v2.

Add the domain you plan to run our app on (ex. localhost).

Add the secret-key to the ```.env``` file.

## Running the server
After cloning this repo, Use `npm i` to install all the dependencies.
Then, use `npm start` to run the server.
