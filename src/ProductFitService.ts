import {DatabaseService} from "./DatabaseService";

export interface ProductFit {
    fit: number;
    product: string;
}

// SQL for migrating the database up from nothing
const migrate_up = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE product_fits (
        id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
        product uuid NOT NULL,
        fit smallint NOT NULL
	);
	
	CREATE INDEX product_fits_product_index ON product_fits(product);
`;

export class ProductFitService {

    private db: DatabaseService;

    public constructor(db: DatabaseService) {
        this.db = db;
    }

    // compute the average fit for a given product
    public async getFit(product: string): Promise<number> {
        const fits = await this.getFits(product);

        if (fits.length === 0) {
            // default to neutral sizing
            return 3;
        }

        // when there is a large amount of fit data, this operation likely doesn't make sense to do here
        // anymore. instead, it should likely be done in the database query. it should also be cached to
        // performance. however, this simple implementation is good enough for this service
        const sum = fits.map((fit: ProductFit) => {
            return fit.fit;
        }).reduce((sum: number, current: number, index: number) => {
            return sum + current;
        });

        // compute the average fit
        return sum / fits.length;
    }

    // get all fit data for a given product
    public async getFits(product: string): Promise<Array<ProductFit>> {
        const result = await this.db.query({
            text: "SELECT * FROM product_fits WHERE product = $1",
            values: [product]
        });

        return result.rows;
    }

    // add new fit data for a given product
    public async saveFit(product: string, fit: number): Promise<boolean> {
        const result = await this.db.query({
            text: "INSERT INTO product_fits(product, fit) VALUES($1, $2)",
            values: [product, fit]
        });

        return result.rowCount === 1;
    }
}
