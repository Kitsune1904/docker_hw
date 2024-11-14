import bcrypt from "bcrypt";
import {ApiError} from "../../middleware/ErrorApi";
import jwt from 'jsonwebtoken'
import {JWT_KEY} from "../../constants";
import {IUser, Role} from "../../models/users";
import {createUser, findUserByEmail} from "../../repository/users.repo";


export const signupNewUser = async (newUser: Partial<IUser>): Promise<IUser> => {
    const hashedPassword: string = await bcrypt.hash(newUser.password as string, 10) ;
    const user = await createUser({
        name: newUser.name!,
        email: newUser.email!,
        role: Role.CUSTOMER,
        password: hashedPassword,
        cart: []
    });
    return user.toObject()
}

export const loginUser = async (email: string, password: string) => {
    const currentUser = await findUserByEmail(email);
    if (!currentUser) {
        throw new ApiError(404, `User ${email} doesn\'t exist`)
    }
    const match = await bcrypt.compare(password, currentUser.password);
    if(!match) {
        throw new ApiError(401, `Invalid password`)
    }
    return jwt.sign({ role: currentUser.role, id: currentUser._id?.toHexString() }, JWT_KEY, { expiresIn: '1h' })
}

