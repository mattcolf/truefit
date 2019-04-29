Truefit Service
===============

The TrueFit service is a small REST web service that can be used to retrieve products, submit fit details,
and retrieve fit details. It's written in Typescript (Javascript) and used Express. For more details, on 
how to use the service, view the [usage](#usage) section below.

## Requirements

Before starting, please ensure that all dependencies are installed.

- Node (8 or above) and NPM
- Postgres

## Getting Started

Getting started with this service isn't much different than any other Node/Express application. The only
difference is that you must transpile the Typescript code before starting the server. Follow these steps 
to get the service up and running.

### Setup

Before running the application, you must first install all dependencies using NPM.

```bash
npm install
```

### Configuration

This application uses a `.env` file fo configuration values. To get started, copy the `.env.dist` file.

```bash
cp .env.dist .env
```

Then, change the following variables to whatever makes sense for your machine.

- `PORT`

  The port that the server will start on, defaults to `8080`.

- `DATABASE_HOST`

  The hostname of the database server to connect to, defaults to `localhost`.

- `DATABASE_USERNAME`

  The username to use when connecting to the database server, defaults to empty string.

- `DATABASE_PASSWORD`

  The passwprd to use when connecting to the database server, defaults to empty string.
  
- `DATABASE_DATABASE`

  The database to use when connecting to the database server, defaults to `truefit`.

### Database Setup

In a real application, we would write migration scripts to manage the database schema in the same way we
manage application releases. In this case, for simplicity, this application assumes that you have already
run the following SQL statements to setup the database.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE product_fits (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    product uuid NOT NULL,
    fit smallint NOT NULL
);
	
CREATE INDEX product_fits_product_index ON product_fits(product);
```

### Compilation

Since this is a Typescript application, you must also transpile the code into Javascript before executing it. 
Once complete, a runnable version of the code will be saved in the `./dist` directory where it can be run.

```bash
npm run build
```

### Running

Once setup, it's time to start the server and make it available for use.

```bash
npm run server
```

You can also run the service with `nodemon` in development to automatically recompile and restart the server 
when changes are detected.

```bash
npm run hot
```

Regardless of how you start it, the service will be available for use at [localhost:8080](http://localhost:8080).


## Testing

This program comes packages with a test suite that you can fun as follows.

``` 
npm run test
```

Once run, you can view coverage reports in the `./coverage` directory. Note that this application only has a couple
tests available at the moment. In a real application, there would be much better test coverage. Enough tests were 
provided for illustrative purpose... they do not represent a full suite as would be expected for a non-example
application.

## Usage

This service provides the following operations.

- `GET /products`

  Retrieve all available products.
  
  **Response**
  
  ```
  Content-Type: application/json

  {
    "products": [
      {
        "id": "1d47bc4ab32d4c5ba694c5664825e605",
        "brand": "Adidas",
        "name": "Yeezy",
        "fit": 3
      }
    ]
  }
  ```

- `GET /products/:id`

  Retrieve a single product.
  
  **Response**
  
    ```
    Content-Type: application/json
  
    {
        "id": "1d47bc4ab32d4c5ba694c5664825e605",
        "brand": "Adidas",
        "name": "Yeezy",
        "fit": 3
    }
    ```

- `GET /products/:id/fits`

  Retrieve all fit data for a given product.
  
  **Response**
  
  ```
  Content-Type: application/json
  
  {
    "fits": [
      {
        "fit": 3,
        "product": "1d47bc4ab32d4c5ba694c5664825e605"
      }
    ]
  }
  ```

- `POST /products/:id/fits`

  Submit fit data for a given product.
  
  **Request**
  
  ```
  POST /products/:id/fits
  Content-Type: application/json
  
  {
    "fit": 3
  }
  ```
  