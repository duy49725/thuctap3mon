import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DiscountCode, User } from "@/config/entity";

interface userDiscountState {
    isLoading: boolean,
    discountList: DiscountCode[]
    discountUser: userDiscount[]
}

interface userDiscount{
    id: number;
    usedAt: Date | null;
    user: User;
    discountCode: DiscountCode;
}

interface userDiscountResponse {
    success: boolean;
    data: userDiscount[]
}

const initialState: userDiscountState = {
    isLoading: false,
    discountList: [],
    discountUser: []
}

export const spiningResult = createAsyncThunk(
    "/discountUser/spinningResult",
    async ({ userId, discountId }: { userId: string, discountId: number }) => {
        const result = await axios.post(`http://localhost:3000/api/shopping/userDiscount/spinningWheel/${userId}/${discountId}`)
        return result.data;
    }
)

export const fecthallDiscountCode = createAsyncThunk(
    "/discountUser/getAll",
    async () => {
        const result = await axios.get(`http://localhost:3000/api/shopping/userDiscount/getAll`);
        return result.data;
    }
)

export const fetchallUserDiscountCode = createAsyncThunk(
    "/discountUser/getByUser",
    async (userId: string) => {
        const result = await axios.get(`http://localhost:3000/api/shopping/userDiscount/getDiscountUser/${userId}`)
        return result.data;
    }
)

const shopUserDiscountSlice = createSlice({
    name: 'shoppingUserDiscount',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthallDiscountCode.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fecthallDiscountCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.discountList = action.payload.data;
            })
            .addCase(fecthallDiscountCode.rejected, (state) => {
                state.isLoading = false;
                state.discountList = [];
            })
            .addCase(fetchallUserDiscountCode.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchallUserDiscountCode.fulfilled, (state, action: PayloadAction<userDiscountResponse>) => {
                state.isLoading = false;
                state.discountUser = action.payload.data;
            })
            .addCase(fetchallUserDiscountCode.rejected, (state) => {
                state.isLoading = false;
                state.discountUser = []
            })
    }
})

export default shopUserDiscountSlice.reducer;

