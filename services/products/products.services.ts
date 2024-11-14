import {ApiError} from "../../middleware/ErrorApi";
import {TProductCSV} from "../../models/models";
import {IProduct, Product, ProductDoc} from "../../models/products";
import * as mongoose from "mongoose";
import {insertProduct} from "../../repository/products.repo";


/**
 * Creates new product
 * @param body
 * @return TProductCSV
 */
export const createNewProduct = (body: TProductCSV) : TProductCSV => {
    const { name, description, category, price } = body;
    if(!name || !description || !category || !price ) {
        throw new ApiError(400, 'Missing required fields')
    }
    return {name, description, category, price}
}

export const addProductInStorage = async (body: TProductCSV): Promise<ProductDoc> => {
    const product: TProductCSV = createNewProduct(body)
    return await insertProduct({
        title: product.name,
        description: product.description,
        category: product.category,
        price: product.price
    });
}

export const getProduct = async (productId: string): Promise<IProduct> => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, 'Wrong id format')
    }
    const currentProduct = (await Product.findOne({_id: productId}).exec()) as ProductDoc;
    if (!currentProduct) {
        throw new ApiError(404, 'Product not found')
    }
    return currentProduct.toObject();
}

export const getAllProductsReal = async (): Promise<IProduct[]> => {
    const array: IProduct[] = []
    for await (const doc of Product.find()){
        array.push(doc as IProduct);
    }
    return array;
}


