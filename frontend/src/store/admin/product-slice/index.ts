import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductResponse } from "@/config/entity";

interface FetchProductResponse {
    success: boolean;
    data: ProductResponse[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalProducts: number;
    }
}

interface AdminProductState {
    isLoading: boolean;
    productList: ProductResponse[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalProduct: number;
}

const initialState: AdminProductState = {
    isLoading: false,
    productList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalProduct: 0
}

export const addNewProduct = createAsyncThunk(
    "/product/adNewProduct",
    async (formData: Omit<Product, 'id'>, { rejectWithValue }) => {
        try {
            console.log(formData, 'dom');
            const result = await axios.post("http://localhost:3000/api/admin/product/add",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            return result.data;
        } catch (error: any) {
            console.log(error.response?.data)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchAllProduct = createAsyncThunk(
    "/product/fetchAllProduct",
    async ({ page = 1, limit = 10 }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const result = await axios.get(`http://localhost:3000/api/admin/product/get?page=${page}&limit=${limit}`);
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const editProduct = createAsyncThunk(
    "/product/editProduct",
    async ({ id, formData }: { id: number, formData: Omit<Product, 'id'> }) => {
        const result = await axios.put(`http://localhost:3000/api/admin/product/update/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                
            }
        )
        return result.data;
    }
)

export const deleteProduct = createAsyncThunk(
    "/product/deleteProduct",
    async (id: number) => {
        const result = await axios.delete(`http://localhost:3000/api/admin/product/delete/${id}`)
        return result.data;
    }
)

const AdminProductSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllProduct.fulfilled, (state, action: PayloadAction<FetchProductResponse>) => {
                state.isLoading = false;
                state.productList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalPages = action.payload.pagination.totalPages;
                state.totalProduct = action.payload.pagination.totalProducts
            })
            .addCase(fetchAllProduct.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            })
            .addCase(addNewProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewProduct.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addNewProduct.rejected, (state) => {
                state.isLoading = false;
            })
    }
})

export default AdminProductSlice.reducer;