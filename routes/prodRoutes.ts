import {NextFunction, Response, Router} from 'express';
import multer, {Multer, StorageEngine} from "multer";
import {
    addProduct,
    getAllProducts,
    getProductById,
    handleProductsFileImport
} from "../controllers/products.controllers";
import {adminOnly} from "../middleware/checkRole";
import asyncMiddleware from "middleware-async";
import {CustomRequest} from "../models/models";

const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage });

const prodRouter: Router = Router();

prodRouter.get('/', asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await getAllProducts(req, res);
    next();
}));

prodRouter.get('/:id', asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await getProductById(req, res);
    next();
}))

prodRouter.post('/product', adminOnly,  asyncMiddleware(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await addProduct(req, res);
    next();
}))

prodRouter.post('/import', upload.single('file'), handleProductsFileImport);


export default prodRouter