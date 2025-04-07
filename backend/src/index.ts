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
import shippingAddressRoute from "@routes/shopping/shippingAddressRoute";
import discountCodeRoute from "@routes/admin/discountRoute";
import usersRoute from "@routes/admin/userRoute";
import rolesRoute from "@routes/admin/roleRoute";
import orderRoute from "@routes/shopping/orderRoute";
import adminOrderRoute from "@routes/admin/orderRoute";
import userDiscountRoute from "@routes/shopping/discountUserRoute";
import reviewRoute from "@routes/shopping/reviewRoute";
import imageUpload from "@routes/common/imageUploadRoute";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import EmailSender from '@controllers/common/send-email'; 


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
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});
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
app.use('/api/admin/discount', discountCodeRoute);
app.use('/api/admin/user', usersRoute);
app.use('/api/admin/role', rolesRoute);
app.use('/api/admin/order', adminOrderRoute);
app.use('/api/auth', authRoute);
app.use('/api/feature', featureRoute);
app.use('/api/shopping/product', productShoppingRoute);
app.use('/api/shopping/cart', cartShoppingRoute);
app.use('/api/shopping/shippingAddress', shippingAddressRoute);
app.use('/api/shopping/order', orderRoute);
app.use('/api/shopping/userDiscount', userDiscountRoute);
app.use('/api/shopping/review', reviewRoute);
app.use('/api/image', imageUpload);
app.post('/send', async(req: Request, res: Response) => {
    try {
        const { fullName,email,phone,message} = req.body
        EmailSender({fullName,email,phone,message})
        console.log(req.body);
        res.json({ msg: "Your message sent successfully" });
      } catch (error: any) {
        res.status(404).json({ msg: error.message });
      }
});

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
})
