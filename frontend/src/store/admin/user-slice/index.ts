import { UserToManage, UserToManageResponse } from "@/config/entity";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface FetchUserResponse{
    success: boolean;
    data: UserToManageResponse[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalUsers: number;
    }
}

interface AdminUserState{
    isLoading: boolean;
    userList: UserToManageResponse[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalUsers: number;
}

const initialState: AdminUserState = {
    isLoading: false,
    userList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalUsers: 0
}

export const addNewUser = createAsyncThunk(
    "/user/addNewUser",
    async(formData: Omit<UserToManage, 'id'>) => {
        const result = await axios.post('http://localhost:3000/api/admin/user/add',
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

export const fetchAllUser = createAsyncThunk(
    "/user/fetchAllUser",
    async({page = 1, limit = 5}: {page: number; limit: number}, {rejectWithValue}) => {
        try {
            const result = await axios.get<FetchUserResponse>(
                `http://localhost:3000/api/admin/user/get?page=${page}&limit=${limit}`
            );
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data || error.message);
        }
    }
)

export const editUser = createAsyncThunk(
    "/user/editUser",
    async({id, formData}: {id: string; formData: Omit<UserToManage, 'id'>}) => {
        const result = await axios.put(
            `http://localhost:3000/api/admin/user/update/${id}`,
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

export const deleteUser = createAsyncThunk(
    "/user/deleteUser",
    async(id: string) => {
        const result = await axios.delete(`http://localhost:3000/api/admin/user/delete/${id}`);
        return result.data;
    }
)

const AdminUserSlice = createSlice({
    name: "adminUser",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllUser.fulfilled, (state, action: PayloadAction<FetchUserResponse>) => {
                state.isLoading = false;
                state.userList = action.payload.data;
                state.currentPage = action.payload.pagination.currentPage;
                state.totalPages = action.payload.pagination.totalPages;
                state.pageSize = action.payload.pagination.pageSize;
                state.totalUsers = action.payload.pagination.totalUsers;
            })
            .addCase(fetchAllUser.rejected, (state) => {
                state.isLoading = false;
                state.userList = [];
            })
    }
})

export default AdminUserSlice.reducer;