import {completeOrder, createOrCompleteCart, deleteProductFromCart} from "../services/cart/cart.services";
import {getProduct} from "../services/products/products.services";
import {Response} from 'express';
import {CustomRequest, ICart} from "../models/models";
import {IProduct} from "../models/products";
import {Checkout} from "../models/orders";

/**
 * Receives a request to add a new product in cart
 * Response by updated cart with new added product
 * @param req
 * @param res
 */
export const addProduct = async (req: CustomRequest, res: Response): Promise<void> => {
    const product: IProduct = await getProduct(req.params.id)
    const cart: ICart = await createOrCompleteCart(product, req.user?.id)
    res.status(201).json(cart);
}
/**
 * Receives a request to delete product from cart by its ID
 * Response by updated cart without deleted product
 * @param req
 * @param res
 */
export const deleteProduct = async (req: CustomRequest, res: Response): Promise<void> => {
    const cart: ICart = await deleteProductFromCart(req.params.id, req.user?.id)
    res.status(200).json(cart);
}

/**
 * Receives a request to show user order info by user ID
 * Response by user order info
 * @param req
 * @param res
 */
export const getOrder = async (req: CustomRequest, res: Response): Promise<void> => {
    const order: Checkout = await completeOrder(req.user!.id!)
    res.status(201).json(order)
}