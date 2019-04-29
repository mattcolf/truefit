import { ProductFitService } from "./ProductFitService";
import { Request, Response } from "express";
import AJV, { Ajv } from "ajv";

// json schema used to validate user input
const save_schema = {
    type: "object",
    properties: {
        fit: {
            type: "integer",
            minimum: 0,
            maximum: 5
        }
    },
    required: [
        "fit"
    ]
};

export class ProductFitController {

    private service: ProductFitService;
    private validator: Ajv;


    constructor(service: ProductFitService, validator: Ajv = new AJV()) {
        this.service = service;
        this.validator = validator;
    }

    // get all product fit data for a given product
    public getProductFits(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            response.status(200).json({ status: "ok", fits: await this.service.getFits(request.params.product) });
        }
    }

    // add new product fit data for a given product
    public saveProductFit(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {

            if (this.validator.validate(save_schema, request.body) !== true) {

                response.status(400).json({ status: "error", message: this.validator.errorsText() });

                return;
            }

            const result = await this.service.saveFit(request.params.product, request.body.fit);

            if (result) {
                response.status(202).json({ status: "ok" });
            } else {
                response.status(500).json( {status: "error", message: "please try again later" })
            }
        }
    }
}
