import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import {JWT_KEY} from "../constants";
import {ApiError} from "./ErrorApi";
import {CustomRequest, IToken} from "../models/models";

export const auth = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token: string = req.cookies.token as string;
    if (!token) {
        throw new ApiError(401, 'Unauthorized');
    }
    try {
        req.user = jwt.verify(token, JWT_KEY) as IToken;
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid token');
    }
}

