import { Role } from "@/config/entity";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface FetchRoleResponse{
    success: boolean;
    data: Role[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalRoles: number;
    }
}

interface AdminRoleState{
    isLoading: boolean;
    roleList: Role[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRoles: number;
}
      
const initialState: AdminRoleState = {
    isLoading: false,
    roleList: [],
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    totalRoles: 0
}

export const addNewRole = createAsyncThunk(
    "/role/addNewRole",
    async(formData: {roleName: string}) => {
        const result = await axios.post('http://localhost:3000/api/admin/role/add',
            formData,{
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return result.data;
    }
)

export const fetchAllRole = createAsyncThunk(
    "/role/fetchAllRole",
    async({page = 1, limit = 10}: {page: number, limit: number}, {rejectWithValue}) => {
        try {
            const result = await axios.get<FetchRoleResponse>(
                `http://localhost:3000/api/admin/role/get?page=${page}&limit=${limit}`
            );
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const editRole = createAsyncThunk(
    "/role/editRole",
    async({id, formData}: {id: number, formData: {roleName: string}}) => {
        const result = await axios.put(
            `http://localhost:3000/api/admin/role/update/${id}`,
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

export const deleteRole = createAsyncThunk(
    "/role/deleteRole",
    async(id: number) => {
        const result  = await axios.delete(`http://localhost:3000/api/admin/role/delete/${id}`);
        return result.data;
    }
)

const AdminRoleSlice = createSlice({
    name: "AdminRole",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllRole.fulfilled, (state, action: PayloadAction<FetchRoleResponse>) => {
                state.isLoading = false;
                state.roleList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.totalPages = action.payload.pagination.totalPages;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalRoles = action.payload.pagination.totalRoles;
            })
            .addCase(fetchAllRole.rejected, (state) => {
                state.isLoading = false;
                state.roleList = [];
            })
    }
})

export default AdminRoleSlice.reducer;