import {NextFunction, Response, Router} from 'express';
import {addProduct, deleteProduct, getOrder} from "../controllers/cart.controllers";
import asyncMiddleware from "middleware-async";
import {CustomRequest} from "../models/models";

const cartRouter: Router = Router();


/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Add product in cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID of the cart item"
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: "Authentication token"
 *     responses:
 *       '201':
 *         description: Added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "9d60e618-d7c7-4d07-9d29-366b6faacc3"
 *                 userId:
 *                   type: string
 *                   example: "6730c07670d1d5d5a4a9b907"
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Digital Painting"
 *                       description:
 *                         type: string
 *                         example: "A custom digital painting created by a professional artist."
 *                       price:
 *                         type: number
 *                         example: 50
 *                       _id:
 *                         type: string
 *                         example: "6721130a25b99bd367c19fd0"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 */
cartRouter.put('/:id', asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await addProduct(req, res);
    next();
}));

cartRouter.delete('/:id', asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await deleteProduct(req, res);
    next();
}))

cartRouter.post('/checkout', asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await getOrder(req, res);
    next();
}))

export default cartRouter