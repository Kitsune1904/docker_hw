import {model, Schema, Model, HydratedDocument} from 'mongoose';
import {IProduct} from "./products";
import * as mongoose from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER"
}

export interface IUser {
    role: Role;
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    cart: IProduct[]
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, '400||User name required'],
        minlength: [3, '400||Too short name'],
        maxlength: [70, '400||Too long name']
    },
    email: {
        type: String,
        required: [true, '400||User email required'],
        match: [new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,5}$/), '400||Malformed email'],
        validate: {
            validator: async function(email: string): Promise<boolean> {
                const model = this.constructor as Model<any>;
                const user = await model.findOne({email}).exec();
                if(!user)
                    return true;
                return user._id.equals(this._id);
            },
            message: '409||Not unique!'
        }
    },
    role: {
        type: String,
        required: [true, '400||Role required'],
        enum: { values: ['ADMIN', 'CUSTOMER'], message: '400||Wrong role' },
    },
    password: { type: String, required: true },
    cart: [{ type: Schema.Types.ObjectId, ref: 'Products' }]
});

// noinspection TypeScriptValidateTypes
export const User = model<IUser>('Users', userSchema);

export type UserDoc = HydratedDocument<IUser>;
