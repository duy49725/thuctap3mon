import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Category{
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface FetchCategoryResponse{
    success: boolean;
    data: Category[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCategories: number;
    }
}

interface AdminCategoryState{
    isLoading: boolean;
    categoryList: Category[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCategories: number;
}

const initialState: AdminCategoryState = {
    isLoading: false,
    categoryList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalCategories: 0
}

export const addNewCategory = createAsyncThunk(
    "/category/addNewCategory",
    async(formData: {name: string; description: string}) => {
        const result = await axios.post('http://localhost:3000/api/admin/category/add',
            formData, 
            {
                headers: {
                    'Content-Type':'application/json'
                }
            }
        )
        return result?.data;
    }
)

export const fetchAllCategory = createAsyncThunk(
    "/category/fetchAllCategory",
    async ({ page = 1, limit = 5 }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const result = await axios.get<FetchCategoryResponse>(
                `http://localhost:3000/api/admin/category/get?page=${page}&limit=${limit}`
            );
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const editCategory = createAsyncThunk(
    "/category/editCategory",
    async ({id, formData}: {id: number; formData: {name: string; description: string}}) => {
        const result = await axios.put(
            `http://localhost:3000/api/admin/category/update/${id}`,
            formData,
            {
                headers: {"Content-Type": "application/json"}
            }
        )
        console.log(result, 'update')
        return result.data;
    }
)

export const deleteCategory = createAsyncThunk(
    "/category/deleteCategory",
    async (id: number) => {
        const result = await axios.delete(`http://localhost:3000/api/admin/category/delete/${id}`);
        return result.data;
    }
)

const AdminCategorySlice = createSlice({
    name: "adminCategory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCategory.fulfilled, (state, action: PayloadAction<FetchCategoryResponse>) => {
                state.isLoading = false;
                state.categoryList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.totalPages = action.payload.pagination.totalPages;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalCategories = action.payload.pagination.totalCategories
            })
            .addCase(fetchAllCategory.rejected, (state) => {
                state.isLoading = false;
                state.categoryList = [];
            })
    }
})

export default AdminCategorySlice.reducer;