import { Request } from 'express';
import {IProduct} from "./products";
import {Role} from "./users";

export interface ICart {
    id: string;
    userId: string;
    products: IProduct[];
}

export type TProductCSV = {
    id?: number
    name: string;
    description: string;
    category: string;
    price: number;
}

export interface IToken {
    role: Role,
    id?: string
}

export type CustomRequest = Request & {
    user?: IToken;
};


