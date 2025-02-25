import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ShippingAddress } from "@/config/entity";

interface addressResponse{
    success: boolean,
    data: ShippingAddress[]
}

const initialShippingAddress: ShippingAddress = {
    id: 0,
    user_id: '',
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false,
    phoneNumber: 0,
    note: ''
}

export const fetchAllShippingAddress = createAsyncThunk(
    "/address/getAllAddress",
    async({page = 1, limit = 10, userId}: {page: number; limit: number, userId: string}) => {
        const result = await axios.get(`http://localhost:3000/api/shopping/shippingAddress/get/${userId}?page=${page}&limit=${limit}`);
        return result.data;
    }
)

export const addShippingAddress = createAsyncThunk(
    "/address/addAddress",
    
    async({userId, formData}: {userId: string, formData: Omit<ShippingAddress, 'id'|'user_id'>}) => {
        console.log(userId);
        const result = await axios.post(`http://localhost:3000/api/shopping/shippingAddress/add/${userId}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return result.data;
    }
)

export const updateShippingAddress = createAsyncThunk(
    "/address/updateAddress",
    async({id, userId, formData}: {id: number, userId: string, formData: Omit<ShippingAddress, 'id'|'user_id'>}) =>{
        const result = await axios.put(`http://localhost:3000/api/shopping/shippingAddress/update/${id}/${userId}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return result.data;
    }
)

export const deleteShippingAddress = createAsyncThunk(
    "/address/deleteAddress",
    async(id: number) => {
        const response = await axios.delete(`http://localhost:3000/api/shopping/shippingAddress/delete/${id}`)
        return response.data;
    }
)

interface shippingAddressState{
    isLoading: boolean,
    addressList: ShippingAddress[];
}

const initialState: shippingAddressState = {
    isLoading: false,
    addressList: []
}

const shopShippingAddressSlice = createSlice({
    name: 'shippingAddress',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllShippingAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllShippingAddress.fulfilled, (state, action: PayloadAction<addressResponse>) => {
                state.isLoading = false;
                state.addressList = action.payload.data;
            })
            .addCase(fetchAllShippingAddress.rejected, (state) => {
                state.isLoading = false;
                state.addressList = [];
            })
    }
})

export default shopShippingAddressSlice.reducer;