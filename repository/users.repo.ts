import {IUser, User, UserDoc} from "../models/users";
import * as mongoose from "mongoose";
import {ApiError} from "../middleware/ErrorApi";

export async function createUser(proto: IUser): Promise<UserDoc>{
    const user = new User(proto);
    const exception: mongoose.Error.ValidationError | null = user.validateSync();
    if(exception) {
        throw new ApiError(400, 'non-valid', exception);
    }
    try {
        await user.save()
    }
    catch(e){
        if(e instanceof mongoose.Error)
            throw new ApiError(409, 'not-unique', e)
        else {
            throw new ApiError(500, 'Unknown', e)
        }
    }
    return user as UserDoc;
}

export async function findUserByEmail(email: string): Promise<IUser|undefined>{
    return await User.findOne({email: email}).exec() as IUser;
}

export async function findUserById(userId: string): Promise<UserDoc>{
    return (await User.findById(new mongoose.Types.ObjectId(userId)).populate('cart').exec()) as UserDoc;
}