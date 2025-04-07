import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Order, OrderDetail, userOrderResponse } from "@/config/entity";
import { initialShippingAddress } from "../address-slice";

interface orderResponse {
    success: boolean,
    data: Order
}

interface initialState {
    approvalURL: string | null,
    isLoading: boolean;
    orderId: number;
    userOrderList: userOrderResponse[];
    orderDetail: any
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
    orderId: 0,
    userOrderList: [],
    orderDetail: null
}

export const createNewOrder = createAsyncThunk(
    "/order/createNewOrder",
    async (orderData: Omit<Order, 'id'>) => {
        const response = await axios.post(
            `http://localhost:3000/api/shopping/order/create`,
            orderData
        )
        return response.data;
    }
)

export const createCapturePayment = createAsyncThunk(
    "/order/capturePayment",
    async ({ paymentId, payerId, orderId }: { paymentId: string, payerId: string, orderId: number }) => {
        const response = await axios.post(
            `http://localhost:3000/api/shopping/order/capture`,
            { paymentId, payerId, orderId }
        )
        return response.data;
    }
)

export const getAllOrderByUser = createAsyncThunk(
    "/order/allOrderByUser",
    async (userId: string) => {
        const response = await axios.get(`http://localhost:3000/api/shopping/order/list/${userId}`)
        return response.data;
    }
)

export const getOrderById = createAsyncThunk(
    "/order/userOrderDetail",
    async (id: number) => {
        const response = await axios.get(`http://localhost:3000/api/shopping/order/detail/${id}`);
        return response.data;
    }
)

const shoppingOrderSlice = createSlice({
    name: "shoppingOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetail = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
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
            .addCase(getAllOrderByUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrderByUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userOrderList = action.payload.data
            })
            .addCase(getAllOrderByUser.rejected, (state) => {
                state.isLoading = false,
                    state.userOrderList = []
            })
            .addCase(getOrderById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.orderDetail = action.payload.data
            })
            .addCase(getOrderById.rejected, (state) => {
                state.isLoading = false,
                    state.orderDetail = null
            })
    }
})
export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;