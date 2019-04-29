import { ProductService } from "./ProductService";
import { Request, Response} from "express";

export class ProductController {

    private service: ProductService;

    constructor(service: ProductService) {
        this.service = service;
    }

    // get a product
    public getProduct(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            const product = await this.service.getProduct(request.params.product);

            if (product === null) {
                response.status(404).json( { status: "not found" } );

                return;
            }

            response.status(200).json({ status: "ok", product: product });
        }
    }

    // get all products
    public getProducts(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            response.status(200).json({ status: "ok", products: await this.service.getProducts() });
        };
    }
}
