import {ProductFitService} from "./ProductFitService";

export interface Product {
    id: string,
    brand: string,
    name: string,
    fit?: number
}

// In a real application we'd talk to the database, but an array of mock products
// will suffice for the purposes of this service.
const data: Array<Product> = [
    {
        id: "f8d96389f8424e80aae05769c7619135",
        brand: "Adidas",
        name: "Yeezy",
    },
    {
        id: "1d47bc4ab32d4c5ba694c5664825e605",
        brand: "Nike",
        name: "Air Max",
    },
    {
        id: "d879b66c7d22449d87d49a454534749d",
        brand: "Adidas",
        name: "Lacombe",
    },
    {
        id: "4a14ac2978554cb0961342f5c43db8e1",
        brand: "Converse",
        name: "Run Star",
    },
    {
        id: "94336f43418f4538b9ed16d35ac1fdbf",
        brand: "Nike",
        name: "Air Trainer",
    },
    {
        id: "4791517ad6204944b16c93497d508880",
        brand: "Nike",
        name: "Jordan Retro",
    },
    {
        id: "15c7159f6ee14ee5be58e4f856e2f422",
        brand: "Nike",
        name: "Blazer",
    },
    {
        id: "49224ab4dc2a4b53a8b166bc3382da42",
        brand: "Adidas",
        name: "Ultra Boost",
    },
    {
        id: "d6b52faf8ca74b63b612c1dec2718106",
        brand: "Nike",
        name: "Lebron 16",
    },
    {
        id: "97c035d35aad43a591003f7729059567",
        brand: "Vans",
        name: "Old Skool",
    }
];

export class ProductService {

    private fit_service: ProductFitService;

    public constructor(fit_service: ProductFitService) {
        this.fit_service = fit_service;
    }

    // get a single product by id
    public async getProduct(id: string): Promise<Product|null> {
        const results = (await this.getProducts()).filter((product: Product) => {
            return product.id === id;
        });

        return results.length === 1 ? results[0] : null;
    }

    // get all products
    public async getProducts(): Promise<Array<Product>> {
        // add in computed product fit data
        // this isn't ideal from a performance perspective. idealy this would be done in the database and the
        // result would be cached to improve performance. this is good enough for this example though.
        let products: Product[] = [];

        for (let product of data) {
            product.fit = await this.fit_service.getFit(product.id);
            products.push(product);
        }

        return products;
    }
}