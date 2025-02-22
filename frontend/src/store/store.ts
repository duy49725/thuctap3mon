import {configureStore} from "@reduxjs/toolkit";
import adminCategorySlice from './admin/category-slice';
import adminFruitTypeSlice from './admin/fruitType-slice';
import adminPromotionSlice from './admin/promotion-slice';
import adminProductSlice from './admin/product-slice';
import adminAuthSlice from './auth/auth-slice';
import commonFeature from './common/feature-slice';
import shopProductSlice from './shopping/product-slice';
import shopCartSlice from './shopping/cart-slice';
const store = configureStore({
    reducer: {
        adminCategory: adminCategorySlice,
        adminFruitType: adminFruitTypeSlice,
        adminPromotion: adminPromotionSlice,
        adminProduct: adminProductSlice,
        adminAuth: adminAuthSlice,
        commonFeature: commonFeature,
        shopProduct: shopProductSlice,
        userCart: shopCartSlice
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;