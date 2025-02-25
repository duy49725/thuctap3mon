import { Product, ProductResponse } from "@/config/entity";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


interface cartResponse {
    success: boolean,
    data: userCart
}

interface userCart {
    id: number,
    createdAt: Date,
    updatedAt: Date,
    cartDetails: cartDetails[],
    totalPrice: number
}

const initializeUserCart = {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    cartDetails: [],
    totalPrice: 0
}

export interface cartDetails {
    id: number;
    quantity: number;
    unitPrice: number;
    createdAt: Date;
    updatedAt: Date;
    product: Omit<ProductResponse, 'categories' | 'promotions' | 'fruitType'>
}

interface cartForm {
    product_id: number;
    userId: string;
    quantity: number;
    unitPrice: number;
}

export const fetchAllCart = createAsyncThunk("/cart/getAllCart", async (id: string) => {
    const result = await axios.get(`http://localhost:3000/api/shopping/cart/get/${id}`);
    return result.data;
})

export const addToCart = createAsyncThunk(
    '/cart/addToCart',
    async ({ userId, product_id, quantity, unitPrice }: cartForm) => {
        console.log({ userId, product_id, quantity, unitPrice })
        const response = await axios.post(`http://localhost:3000/api/shopping/cart/add`,
            { userId, product_id, quantity, unitPrice },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
)

export const updateCartItem = createAsyncThunk(
    "/cart/updateCartItem",
    async ({ cartDetail_id, quantity }: { cartDetail_id: number, quantity: number }) => {
        const response = await axios.put(`http://localhost:3000/api/shopping/cart/update`,
            { cartDetail_id, quantity },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
)

export const deleteCartItem = createAsyncThunk(
    "/cart/deleteCartItem",
    async (cartDetail_id: number) => {
        const response = await axios.delete(`http://localhost:3000/api/shopping/cart/remove/${cartDetail_id}`);
        return response.data;
    }
)

interface cartState {
    isLoading: boolean,
    cartList: userCart,
}

const initialState: cartState = {
    isLoading: false,
    cartList: initializeUserCart
}

const shopProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCart.fulfilled, (state, action: PayloadAction<cartResponse>) => {
                state.isLoading = false;
                state.cartList = action.payload.data;
            })
            .addCase(fetchAllCart.rejected, (state) => {
                state.isLoading = false;
                state.cartList = initializeUserCart
            })
    }
})

export default shopProductSlice.reducer
