import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Order, userOrderResponse } from "@/config/entity";

interface orderResponse{
    success: boolean,
    data: Order
}

interface initialState{
    isLoading: boolean,
    orderList: Order[],
    orderDetail: any;
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
    isLoading: false,
    orderList: [],
    orderDetail: null
}

export const getAllOrdersOfAllUser = createAsyncThunk(
    "/order/getAllOrderOfAllUser",
    async() => {
        const result = await axios.get('http://localhost:3000/api/admin/order/getAllOrder');
        return result.data;
    }
)

export const getOrderDetailsForAdmin = createAsyncThunk(
    "/order/getOrderDetailForAdmin",
    async(id: number) => {
        const result = await axios.get(`http://localhost:3000/api/admin/order/getOrderDetail/${id}`);
        return result.data;
    }
)

export const updateOrderStatus = createAsyncThunk(
    "/order/updateOrderStatus",
    async({id, status}: {id: number, status: string}) => {
        const result = await axios.put(`http://localhost:3000/api/admin/order/updateOrderStatus/${id}`,
            {status: status},
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return result.data;
    }
)

const adminOrderSlice = createSlice({
    name: "adminOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetail = null
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(getAllOrdersOfAllUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllOrdersOfAllUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersOfAllUser.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
            })
            .addCase(getOrderDetailsForAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetail = action.payload.data;
            })
            .addCase(getOrderDetailsForAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderDetail = null
            })
    }
})

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;