import request from 'supertest';
import {app} from '../index';
import mongoose from 'mongoose';
import {describe} from "node:test";
import {MONGO} from "../constants";
import {IUser, Role, User} from "../models/users";
import {generateAdmin} from "../services/admin/createAdmin";
import {Product} from "../models/products";

describe('API E2E Tests', () => {
    beforeAll(() => {
        return new Promise<void> ((resolve) => {
            mongoose.connect(MONGO).then(async () => {
                await generateAdmin();
                resolve()
            });
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

    /**
     * Tests for /api/register
     */
    it('should register a new user successfully', () => {
        return new Promise<void>((resolve) => {
            const newUser: Partial<IUser> = {
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'testpassword'
            };
            request(app)
                .post('/api/register')
                .send(newUser)
                .then((response) => {
                    expect(response.status).toBe(201);
                    expect(response.body).toHaveProperty('_id');
                    expect(response.body.name).toBe(newUser.name);
                    expect(response.body.email).toBe(newUser.email);
                    expect(response.body.role).toBe(Role.CUSTOMER);
                    expect(response.body).not.toHaveProperty('password');
                    resolve();
                });
        });
    });
    it('should not register a new user with malformed data', () => {
        return new Promise<void>((resolve) => {
            const newUser: Partial<IUser> = {
                name: 'Test User',
                email: 'testuserexample.com',
                password: 'testpassword'
            };
            request(app)
                .post('/api/register')
                .send(newUser)
                .then((response) => {
                    expect(response.status).toBe(400);
                    expect(response.body.message).toEqual('non-valid')
                    expect(response.body).toHaveProperty('data');
                    resolve();
                });
        });
    });
    it('should not register duplication of user', () => {
        return new Promise<void>((resolve) => {
            const newUser: Partial<IUser> = {
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'testpassword'
            };
            request(app)
                .post('/api/register')
                .send(newUser)
                .then((response) => {
                    expect(response.status).toBe(409);
                    expect(response.body.message).toEqual('not-unique')
                    expect(response.body).toHaveProperty('data');
                    resolve();
                });
        });
    });

})


