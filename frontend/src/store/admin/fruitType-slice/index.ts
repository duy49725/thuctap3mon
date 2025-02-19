import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface FruitType{
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface FetchFruitTypeResponse{
    success: boolean;
    data: FruitType[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalFruitType: number;
    }
}

interface AdminFruitTypeState{
    isLoading: boolean;
    fruitTypeList: FruitType[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalFruitTypes: number;
}

const initialState: AdminFruitTypeState = {
    isLoading: false,
    fruitTypeList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalFruitTypes: 0
}

export const addNewFruitType = createAsyncThunk(
    "/fruitType/addNewFruitType",
    async(formData: {name: string; description: string}) => {
        const result = await axios.post('http://localhost:3000/api/admin/fruitType/add', 
            formData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return result.data;
    }
)

export const fetchAllFruitType = createAsyncThunk(
    "/fruitType/fetchAllFruitType",
    async({page = 1, limit = 5}: {page: number; limit: number}, {rejectWithValue}) => {
        try {
            const result = await axios.get(`http://localhost:3000/api/admin/fruitType/get?page=${page}&limit=${limit}`)
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const editFruitType = createAsyncThunk(
    "/fruitType/editFruitType",
    async({id, formData}: {id: number, formData: {name:string; description: string}}) => {
        const result = await axios.put(`http://localhost:3000/api/admin/fruitType/update/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return result.data;
    }
)

export const deleteFruitType = createAsyncThunk(
    "/fruitType/deleteFruitType",
    async(id: number) => {
        const result = await axios.delete(`http://localhost:3000/api/admin/fruitType/delete/${id}`);
        return result.data;
    }
)

const AdminFruitTypeSlice = createSlice({
    name: "fruitTypeSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFruitType.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFruitType.fulfilled, (state, action: PayloadAction<FetchFruitTypeResponse>) => {
                state.isLoading = false;
                state.fruitTypeList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.totalPages = action.payload.pagination.totalPages;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalFruitTypes = action.payload.pagination.totalFruitType;
            })
            .addCase(fetchAllFruitType.rejected, (state) => {
                state.isLoading = false;
                state.fruitTypeList = [];
            })
    }
})

export default AdminFruitTypeSlice.reducer;