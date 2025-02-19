import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { EditPromotionForm as Promotion } from "@/components/admin-view/promotion-component/promotion-update";

interface FetchPromotionResponse{
    success: boolean;
    data: Promotion[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalPromotions: number;
    }
} 

interface AdminPromotionState{
    isLoading: boolean;
    promotionList: Promotion[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalPromotions: number;
}

const initialState: AdminPromotionState = {
    isLoading: false,
    promotionList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalPromotions: 0
}

export const addNewPromotion = createAsyncThunk(
    "/promotion/addNewPromotion",
    async (formData: Omit<Promotion, 'id'>) => {
        console.log(formData)
        const result = await axios.post("http://localhost:3000/api/admin/promotion/add", formData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return result.data;
    }
)

export const fetchAllPromotion = createAsyncThunk(
    "/promotion/fetchAllPromotion",
    async({page = 1, limit = 10}: {page: number; limit: number}, {rejectWithValue}) => {
       try {
            const result = await axios.get(`http://localhost:3000/api/admin/promotion/get?page=${page}&limit=${limit}`);
            return result.data;
       } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
       }
    }
)

export const editPromotion = createAsyncThunk(
    "/promotion/editPromotion",
    async({id, formData}: {id: number, formData: Omit<Promotion, 'id'>}) => {
        const result = await axios.put(`http://localhost:3000/api/admin/promotion/update/${id}`,
            formData,
            {
                headers:{
                    'Content-Type': 'application/json'
                }
            }
        )
        return result.data;
    }
)

export const deletePromotion = createAsyncThunk(
    "/promotion/deletePromotion",
    async(id: number) => {
        const result = await axios.delete(`http://localhost:3000/api/admin/promotion/delete/${id}`);
        return result.data;
    }
)

const AdminPromotionSlice = createSlice({
    name: "promotionSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPromotion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllPromotion.fulfilled, (state, action: PayloadAction<FetchPromotionResponse>) => {
                state.isLoading = false;
                state.promotionList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalPages = action.payload.pagination.totalPages;
                state.totalPromotions = action.payload.pagination.totalPromotions;
            })
            .addCase(fetchAllPromotion.rejected, (state) => {
                state.isLoading = false;
                state.promotionList = [];
            })
    }
})

export default AdminPromotionSlice.reducer;