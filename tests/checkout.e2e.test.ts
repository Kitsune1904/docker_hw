import {describe} from "node:test";
import mongoose from "mongoose";
import {ADMIN_EMAIL, ADMIN_PASSWORD, MONGO} from "../constants";
import request from "supertest";
import {app} from "../index";
import {User} from "../models/users";
import {Product} from "../models/products";
import {Order} from "../models/orders";
import {generateAdmin} from "../services/admin/createAdmin";
import {importPredefined} from "../services/admin/admin.products";
import {findUserByEmail} from "../repository/users.repo";
import {getAllProductsReal} from "../services/products/products.services";
import {loginUser} from "../services/user/user.services";
import {serialize} from "cookie";
import {createOrCompleteCart} from "../services/cart/cart.services";

describe('API E2E Tests products', () => {
    let userId = '';
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
                if(products.length > 0){
                    await createOrCompleteCart(products[0], userId);
                }
                resolve();
            });
        });
    });

    afterAll(() => {
        return new Promise<void>(async (resolve) => {
            await User.deleteMany();
            await Product.deleteMany();
            await Order.deleteMany();
            await mongoose.disconnect();
            resolve();
        });
    });

    /**
     * Tests for /api/cart/checkout
     */
    it('should not show not exist cart of an authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .post(`/api/cart/checkout`)
                .set("Cookie", [cookieL])
                .then((response) => {
                    expect(response.status).toBe(201);
                    expect(response.body.order.userId).toBe(userId);
                    expect(response.body.order.userId).toEqual(response.body.user._id);
                    expect(response.body.order.products.length).toBeGreaterThan(0);
                    expect(response.body.order.totalPrice).toBeGreaterThan(0);
                    resolve();
                });
        });
    });

    it('should not show cart if it is empty for authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .post(`/api/cart/checkout`)
                .set("Cookie", [cookieL])
                .then((response) => {
                    expect(response.status).toBe(404);
                    expect(response.body.message).toEqual("Cart not found");
                    resolve();
                });
        });
    });

    it('should not show cart with products of an authorized user non authorized user', () => {
        return new Promise<void>((resolve) => {
            request(app)
                .post(`/api/cart/checkout`)
                .then((response) => {
                    expect(response.status).toBe(401);
                    expect(response.body.message).toEqual("Unauthorized");
                    resolve();
                });
        });
    });

})