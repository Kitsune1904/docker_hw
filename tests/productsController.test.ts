import {MONGO} from "../constants";
import mongoose from "mongoose";
import {generateAdmin} from "../services/admin/createAdmin";
import {importPredefined} from "../services/admin/admin.products";
import {User} from "../models/users";
import {Product} from "../models/products";
import {TProductCSV} from "../models/models";
import {
    addProductInStorage,
    getAllProductsReal,
    getProduct
} from "../services/products/products.services";
import {products} from "../repository/storage";

beforeAll(() => {
    return new Promise<void>(async (resolve) => {
        await mongoose.connect(MONGO);
        await generateAdmin();
        await importPredefined();
        resolve();
    });
});

afterAll(() => {
    return new Promise<void>(async (resolve) => {
        await User.deleteMany();
        await Product.deleteMany();
        await mongoose.disconnect();
        resolve();
    });
});


describe("Products Integration Tests", () => {
    let id: string = ''

    it("should create a new item", async () => {
        const itemData: TProductCSV = {
            name: "Test Item",
            description: "description",
            category: "category",
            price: 545
        };
        const item = await addProductInStorage(itemData);
        expect(item).toHaveProperty("_id");
        expect(item.title).toBe("Test Item");
    });

    it("should retrieve all items", async () => {
        const items = await getAllProductsReal();
        expect(items.length).toBe(products.length + 1);
        id = items[products.length]._id!.toHexString()
    });

    it("should retrieve an item by ID", async () => {
        const fetchedItem = await getProduct(id);
        expect(fetchedItem).not.toBeNull();
        expect(fetchedItem?.title).toBe("Test Item");
    });

});