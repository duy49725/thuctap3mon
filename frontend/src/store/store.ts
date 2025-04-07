import {configureStore} from "@reduxjs/toolkit";
import adminCategorySlice from './admin/category-slice';
import adminFruitTypeSlice from './admin/fruitType-slice';
import adminPromotionSlice from './admin/promotion-slice';
import adminProductSlice from './admin/product-slice';
import adminAuthSlice from './auth/auth-slice';
import adminDiscountSlice from './admin/discount-slice';
import adminRoleSlice from './admin/role-slice';
import adminUserSlice from './admin/user-slice';
import adminOrderSlice from  './admin/order-slice';
import commonFeature from './common/feature-slice';
import shoppingUserReview from './shopping/review-slice';
import shopProductSlice from './shopping/product-slice';
import shopCartSlice from './shopping/cart-slice';
import shopShippingAddressSlice from './shopping/address-slice';
import shoppingOrderSlice from './shopping/order-slice';
import shopUserDiscountSlice from './shopping/userDiscount-slice';

const store = configureStore({
    reducer: {
        adminCategory: adminCategorySlice,
        adminFruitType: adminFruitTypeSlice,
        adminPromotion: adminPromotionSlice,
        adminProduct: adminProductSlice,
        adminAuth: adminAuthSlice,
        adminDiscount: adminDiscountSlice,
        adminRole: adminRoleSlice,
        adminUser: adminUserSlice,
        adminOrder: adminOrderSlice,
        commonFeature: commonFeature,
        shopProduct: shopProductSlice,
        shoppAddress: shopShippingAddressSlice,
        shopOrder: shoppingOrderSlice,
        userCart: shopCartSlice,
        userReview: shoppingUserReview,
        userDiscount: shopUserDiscountSlice
    }
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;