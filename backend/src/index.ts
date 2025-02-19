import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './database/data-source';
import fruitTypeRoute from '@routes/admin/fruitTypeRoute';
import categoryRoute from '@routes/admin/categoryRoute';
import promotionRoute from '@routes/admin/promotionRoute';
import productRoute from '@routes/admin/productRoute';
import authRoute from '@routes/auth/authRoute';
import featureRoute from '@routes/common/featureRoute';
import productShoppingRoute from "@routes/shopping/productRoute";
import cartShoppingRoute from "@routes/shopping/cartRoute";
import cors from 'cors';


dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true
    })
);

app.use(express.json());

AppDataSource.initialize().then(() => {
    console.log('database connected');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log(err);
})

app.use('/api/admin/fruittype', fruitTypeRoute);
app.use('/api/admin/category', categoryRoute);
app.use('/api/admin/promotion', promotionRoute);
app.use('/api/admin/product', productRoute);
app.use('/api/auth', authRoute);
app.use('/api/feature', featureRoute);
app.use('/api/shopping/product', productShoppingRoute);
app.use('/api/shopping/cart', cartShoppingRoute);


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
})
