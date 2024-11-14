import {IProduct} from "../../models/products";
import {products} from "../../repository/storage";
import {insertProduct} from "../../repository/products.repo";

export async function importPredefined () :Promise<void> {
    const prod: IProduct[] = [...products];
    for(let i = 0; i < products.length; i++){
        try{
            await insertProduct({
                title: prod[i].title,
                description: prod[i].description,
                price: prod[i].price,
            })
        }
        catch (err){}
    }
}