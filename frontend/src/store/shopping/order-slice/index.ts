import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Order, OrderDetail } from "@/config/entity";

interface orderResponse{
    success: boolean,
    data: Order
}

interface initialState{
    approvalURL: string | null,
    isLoading: boolean
    orderId: number
}

const initialOrder: Order = {
    id: 0,
    userId: '',
    cartId: 0,
    discountCodeId: 0,
    subTotal: 0,
    discountAmount: 0,
    totalAmount: 0,
    status: '',
    shippingAddressId: 0,
    paymentMethod: '',
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentStatus: '',
    paymentId: '',
    payerId: ''
}

const initialState: initialState = {
    approvalURL: '',
    isLoading: false,
    orderId: 0
}

export const createNewOrder = createAsyncThunk(
    "/order/createNewOrder",
    async(orderData: Omit<Order, 'id'>) => {
        const response = await axios.post(
            `http://localhost:3000/api/shopping/order/create`,
            orderData
        )
        return response.data;
    }
)

export const createCapturePayment = createAsyncThunk(
    "/order/capturePayment",
    async({paymentId, payerId, orderId}: {paymentId: string, payerId: string, orderId: number}) => {
        const response = await axios.post(
            `http://localhost:3000/api/shopping/order/capture`,
            {paymentId, payerId, orderId}
        )
        return response.data;
    }
)

const shoppingOrderSlice = createSlice({
    name: "shoppingOrderSlice",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvalURL = action.payload.data.approvalUrl,
                state.orderId = action.payload.data.orderId
                sessionStorage.setItem(
                    "currentOrderId",
                    JSON.stringify(action.payload.data.orderId)
                )
            })
            .addCase(createNewOrder.rejected, (state) => {
                state.isLoading = false;
                state.approvalURL = '';
                state.orderId = 0;
            })
    }
})

export default shoppingOrderSlice.reducer;