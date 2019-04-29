import { json } from "body-parser";
import { Request, Response, NextFunction, Handler } from "express";
import { ProductController } from "./ProductController";
import { ProductService } from "./ProductService";
import { ProductFitController } from "./ProductFitController";
import { ProductFitService } from "./ProductFitService";
import { DatabaseService } from "./DatabaseService";
import { Config } from "./Config";

const config = new Config(process.env as any);
const cors = require("cors");
const app = require("express")();

const db = new DatabaseService(config.getDatabaseHost(), config.getDatabaseUsername(), config.getDatabasePassword(), config.getDatabaseDatabase());

const product_fit_service = new ProductFitService(db);
const product_service = new ProductService(product_fit_service);
const products = new ProductController(product_service);
const fits = new ProductFitController(product_fit_service);

app.use(cors());
app.use(json());

// wrap async handlers and catch rejected promises so the errors can be handled normally
const catcher: (handler: (req: Request, res: Response, next: NextFunction | undefined) => Promise<any>) => void
    = handler => (req: Request, res: Response, next: NextFunction) => handler(req, res, next).catch(next);

app.get("/health-check", (request: Request, response: Response) => {
    response.status(200).json({ status: "ok" });
});

// global error handler
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    // add error handling here
    console.error('An unknown error occurred.', error);

    return response.status(500).send('An unknown error occurred.');
});

// force all usages of the product param to be a valid GUID value
app.param("product", (request: Request, response: Response, next: NextFunction) => {
    if (!/^[0-9a-f]{32}$/.test(request.params.product)) {
        response.status(400).json( { status: "error", message: "Expected product to be a valid GUID values." } );

        return;
    }

    next()
});

// allow users to retrieve all products
app.get("/products", catcher(products.getProducts()));

// allow users to retrieve a specific product
app.get("/products/:product", catcher(products.getProduct()));

// allow users to retrieve all fit values for a specific product
app.get("/products/:product/fits", catcher(fits.getProductFits()));

// allow users to submit a fit value for a specific product
app.post("/products/:product/fits", catcher(fits.saveProductFit()));

// start the server
app.listen(config.getPort(), () => {
    console.log(`Started server on port ${config.getPort()}`);
});
