import {describe} from "node:test";
import mongoose from "mongoose";
import {ADMIN_EMAIL, ADMIN_PASSWORD, MONGO} from "../constants";
import request from "supertest";
import {app} from "../index";
import {User} from "../models/users";
import {Product} from "../models/products";
import {getAllProductsReal} from "../services/products/products.services";
import {findUserByEmail} from "../repository/users.repo";
import {generateAdmin} from "../services/admin/createAdmin";
import {importPredefined} from "../services/admin/admin.products";
import {loginUser} from "../services/user/user.services";
import {serialize} from "cookie";

describe('API E2E Tests products', () => {
    let productId = '';
    let userId: string = '';
    let cookieL: any;

    beforeAll(() => {
        return new Promise<void> ((resolve) => {
            mongoose.connect(MONGO).then(async () => {
                await generateAdmin();
                await importPredefined();
                const token = await loginUser(ADMIN_EMAIL, ADMIN_PASSWORD);
                cookieL = serialize("token", token, {
                    httpOnly: true,
                    expires: new Date(new Date().getTime() + 60 * 60 * 1000),
                });
                const user = await findUserByEmail(ADMIN_EMAIL)
                if(user)
                    userId = user._id!.toHexString();
                const products = await getAllProductsReal();
                if(products.length > 0)
                    productId = products[0]._id!.toHexString()
                resolve();
            });
        });
    }, 10000);

    afterAll(() => {
        return new Promise<void>(async (resolve) => {
            await User.deleteMany();
            await Product.deleteMany();
            await mongoose.disconnect();
            resolve();
        });
    });

    /**
     * Tests for /api/cart/{productId}
     */
    it('should add a product to the cart for an authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .put(`/api/cart/${productId}`)
                .set("Cookie", [cookieL])
                .then((response) => {
                    expect(response.status).toBe(201);
                    expect(response.body.userId).toBe(userId);
                    expect(response.body.products.length).toBeGreaterThan(0);
                    resolve();
                });
        });
    });

    it('should not add a product to the cart for non authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .put(`/api/cart/${productId}`)
                .then((response) => {
                    expect(response.status).toBe(401);
                    expect(response.body.message).toEqual("Unauthorized");
                    resolve();
                });
        });
    });

    it('should not add a wrong format id product to the cart for authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .put(`/api/cart/${productId}-non-exisiting`)
                .set("Cookie", [cookieL])
                .then((response) => {
                    expect(response.status).toBe(400);
                    expect(response.body.message).toEqual("Wrong id format");
                    resolve();
                });
        });
    });

    it('should not add a wrong id product to the cart for authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .put(`/api/cart/${productId.replace(/a/g, 'b')}`)
                .set("Cookie", [cookieL])
                .then((response) => {
                    expect(response.status).toBe(404);
                    expect(response.body.message).toEqual("Product not found");
                    resolve();
                });
        });
    });
})
