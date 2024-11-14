import express, {Express, NextFunction, Response} from 'express';
import cartRouter from "./routes/cartRoutes";
import {PORT} from "./constants";
import {login, signUp} from "./controllers/user.controllers";
import {errorHandler} from "./middleware/errorHandler";
import prodRouter from "./routes/prodRoutes";
import './services/admin/createAdmin'
import {auth} from "./middleware/auth";
import cookieParser from 'cookie-parser';
import connectToDB from "./repository/mongo";
import "express-async-errors";
import {generateAdmin} from "./services/admin/createAdmin";
import {importPredefined} from "./services/admin/admin.products";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";
import asyncMiddleware from "middleware-async";
import {CustomRequest} from "./models/models";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Items API',
            version: '1.0.0',
        },
    },
    apis: [
        '*.ts',
        './routes/*.ts'
    ],};

export const app: Express = express();

const swaggerSpec = swaggerJSDoc(options);


app.use(express.json());

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.post('/api/register', asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await signUp(req, res);
    next();
}));
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "admin_password"
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User admin@example.com doesn't exist"
 *       '401':
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid password"
 */

app.post('/api/login', login);

app.use('/api/products', auth, prodRouter);

app.use('/api/cart', auth, cartRouter);

app.use(errorHandler);

connectToDB()
    .then(async () => {
        if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV != 'localTest') {
            await generateAdmin();
            await importPredefined();
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    })
    .catch((err) => console.error(err));


