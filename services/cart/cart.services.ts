import crypto from "crypto";
import {ApiError} from "../../middleware/ErrorApi";
import {ICart} from "../../models/models";
import {IProduct, ProductDoc} from "../../models/products";
import {UserDoc} from "../../models/users";
import {Checkout, Order} from "../../models/orders";
import {findProductByTitle} from "../../repository/products.repo";
import {findUserById} from "../../repository/users.repo";
import * as mongoose from "mongoose";

/**
 * Adds product in new or existed user's cart
 * @param product
 * @param userId
 * @return ICart
 */
export const createOrCompleteCart = async (product: IProduct, userId?: string):Promise<ICart> => {
    const currentUser: UserDoc = await findUserById(userId!);
    const currentProduct: ProductDoc = await findProductByTitle(product.title);
    currentUser.cart.push(currentProduct);
    await currentUser.save();
    return {
        id: crypto.randomUUID(),
        userId: userId!,
        products: [...currentUser.cart]
    }
}

/**
 * Delete product from user's cart
 * @param prodId
 * @param userId
 * @return ICart
 */
export const deleteProductFromCart = async (prodId: string, userId?: string): Promise<ICart> => {
    const currentUser: UserDoc = await findUserById(userId!);
    const prodIndex: number = currentUser.cart.findIndex((product: IProduct): boolean => {
        return product._id!.equals(new mongoose.Types.ObjectId(prodId));
    });
    if (prodIndex === -1) {
        throw new ApiError(404, 'Product not found in cart')
    }
    currentUser.cart.splice(prodIndex, 1);
    await currentUser.save();
    return {
        id: crypto.randomUUID(),
        userId: userId!,
        products: [...currentUser.cart]
    }
}

/**
 * By user ID take its cart and create an order
 * @param userId
 * @return Checkout
 */
export const completeOrder = async (userId: string): Promise<Checkout> => {
    const currentUser: UserDoc = await findUserById(userId!);
    if (!currentUser || currentUser.cart.length === 0) {
        throw new ApiError(404, 'Cart not found')
    }
    const userOrder  = new Order ({
        id: crypto.randomUUID(),
        userId: userId.toString(),
        products: [...currentUser.cart],
        totalPrice: currentUser.cart.reduce((acc: number, prod: IProduct): number => acc + prod.price, 0)
    })
    currentUser.cart = [];
    await currentUser.save();
    await userOrder.save();
    return {
        order: userOrder.toObject(),
        user: currentUser.toObject()
    }
}
