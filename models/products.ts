import {HydratedDocument, Model, model, Schema} from 'mongoose';
import * as mongoose from "mongoose";

export interface IProduct {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category?: string
    price: number;
}

const productSchema = new Schema<IProduct>({
    category: { type: String },
    title: {
        type: String,
        required: [true, '400||Product title required'],
        maxlength: [70, '400||Too long title'],
        validate: [
            {
                validator: async function(title: string): Promise<boolean> {
                    const model = this.constructor as Model<any>;
                    const product = await model.findOne({title}).exec();
                    return !product;
                },
                message: '409||Not unique'
            }
        ]
    },
    description: {
        type: String,
        required: [true, '400||Product description required'],
        validate: {
            validator: function (value: string): boolean {
                return value.length <= 256
            },
            message: '400||Too long description'
        }
    },
    price: {
        type: Number,
        required: [true, '400||Product price required'],
    }
})

// noinspection TypeScriptValidateTypes
export const Product = model<IProduct>('Products', productSchema);

export type ProductDoc = HydratedDocument<IProduct>;