import {IProduct} from "./products";
import {model, Schema} from "mongoose";
import {IUser} from "./users";

export interface IOrder {
    userId: string;
    products: IProduct[];
    totalPrice: number;
}

const orderSchema = new Schema<IOrder>({
    userId: { type: String },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }],
    totalPrice: { type: Number }
})

// noinspection TypeScriptValidateTypes
export const Order = model<IOrder>('Orders', orderSchema);

export type Checkout = {
    user: IUser,
    order: IOrder
}