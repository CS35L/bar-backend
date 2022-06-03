BAR Backend
===========

This is the backend part of the BAR app.

To see the project proposal, see [Here](docs/proposal.md)

To see the design documentation, see [Here](docs/design.md)

This project is writtn in JavaScript, with the standard of [ECMAScript 2017](https://262.ecma-international.org/8.0/).

This project is created using the following techstacks:
- [NodeJS](https://nodejs.org/en/) for running web server.
- [KoaJS](https://koajs.com/) for routing.
- [Nginx](https://www.nginx.com/) for reverse proxy.
- [reCAPTCHA V2](https://www.google.com/recaptcha/about/) for CAPTCHA services.
- [PostgreSQL](https://www.postgresql.org/) for our database.
- [PGAdmin](https://www.pgadmin.org/) for managing our database.
# Building
## Initializing the data base.
See [Here](docs/createdb.md)

## Configure .env

Make a copy of `.env.example` and name it `.env`, change the `.env` file according to your configurations.

## Configure reCAPTCHA

Generate your site-key and secret-key at https://www.google.com/recaptcha/admin/create using reCAPTCHA v2.

Add the domain you plan to run our app on (ex. localhost).

Add the secret-key to the `.env` file.

## Running the server

*** Please make sure you have `npm` and `node` installed from https://nodejs.org/en/ ***

After cloning this repo, Use `npm i` to install all the dependencies.

Then, use `npm start` to run the server.

If successful, you should see

```
initializing database...
database ok.
initializing server...
server ok.
```