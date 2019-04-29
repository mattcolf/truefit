import { Config } from "../src/config";

// In a real application there would be many more tests. Just adding this for illustrative purposes since
// this is an example application.

describe("Config Service", () => {

    it("reads configuration correctly", () => {

        const config = new Config({
            PORT: "9000",
            DATABASE_HOST: "a",
            DATABASE_USERNAME: "b",
            DATABASE_PASSWORD: "c",
            DATABASE_DATABASE: "d"
        });

        expect(config.getPort()).toEqual(9000);
        expect(config.getDatabaseHost()).toEqual("a");
        expect(config.getDatabaseUsername()).toEqual("b");
        expect(config.getDatabasePassword()).toEqual("c");
        expect(config.getDatabaseDatabase()).toEqual("d");
    });

    it("loads default values correctly", () => {

        const config = new Config({} as any);

        expect(config.getPort()).toEqual(8080);
        expect(config.getDatabaseHost()).toEqual("localhost");
        expect(config.getDatabaseUsername()).toEqual("");
        expect(config.getDatabasePassword()).toEqual("");
        expect(config.getDatabaseDatabase()).toEqual("truefit");
    });
});