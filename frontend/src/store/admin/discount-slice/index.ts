import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DiscountCode } from "@/config/entity";

interface FetchDiscountCodeResponse{
    success: boolean;
    data: DiscountCode[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalDiscountCodes: number;
    }
}

interface AdminDiscountCodeState{
    isLoading: boolean;
    discountCodeList: DiscountCode[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalDiscountCodes: number;
}

const initialState: AdminDiscountCodeState = {
    isLoading: false,
    discountCodeList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalDiscountCodes: 0
}

export const addNewDiscount = createAsyncThunk(
    "/discount/addNewDiscount",
    async(formData: Omit<DiscountCode, 'id'>) => {
        const result = await axios.post('http://localhost:3000/api/admin/discount/add',
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

export const fetchAllDiscount = createAsyncThunk(
    "/discount/fetchAllDiscount",
    async({page = 1, limit = 10}: {page: number; limit: number}, {rejectWithValue}) => {
        try {
            const result = await axios.get(`http://localhost:3000/api/admin/discount/get?page=${page}&limit=${limit}`);
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const editDiscount = createAsyncThunk(
    "/discount/editDiscount",
    async({id, formData}: {id: number, formData: Omit<DiscountCode, 'id'>}) => {
        const result = await axios.put(`http://localhost:3000/api/admin/discount/update/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return result.data;
    }
)

export const deleteDiscount = createAsyncThunk(
    "/discount/deleteDiscount",
    async(id: number) => {
        const result = await axios.delete(`http://localhost:3000/api/admin/discount/delete/${id}`);
        return result.data;
    }
)

const AdminDiscountSlice = createSlice({
    name: 'discountSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDiscount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllDiscount.fulfilled, (state, action: PayloadAction<FetchDiscountCodeResponse>) => {
                state.isLoading = false;
                state.discountCodeList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalPages = action.payload.pagination.totalPages;
                state.totalDiscountCodes = action.payload.pagination.totalDiscountCodes;
            })
            .addCase(fetchAllDiscount.rejected, (state) => {
                state.isLoading = false;
                state.discountCodeList = [];
            })
    }
})

export default AdminDiscountSlice.reducer;