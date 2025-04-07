import { UserFormData, User } from "@/config/entity";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


interface AdminUserState {
    isLoading: boolean;
    user: User,
    isAuthenticated: boolean
}
const initialState: AdminUserState = {
    isLoading: false,
    user: {
        userId: "",
        email: "",
        fullName: "",
        avatar: "",
        roles: []
    },
    isAuthenticated: false
}

interface FetchUserResponse{
    success: boolean,
    data: string,
    user: User
}

export const registerUser = createAsyncThunk(
    "/auth/registerUser",
    async (formData: UserFormData, { rejectWithValue }) => {
        try {
            const result = await axios.post("http://localhost:3000/api/auth/register",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const loginUser = createAsyncThunk(
    "/auth/loginUser",
    async (formData: Omit<UserFormData, 'fullName'>, { rejectWithValue }) => {
        try {
            const result = await axios.post("http://localhost:3000/api/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const loginGoogle = createAsyncThunk(
    '/auth/google',
    async (formData: {email: string | null, fullName: string | null, avatar: string | null}) => {
        const response = await axios.post('http://localhost:3000/api/auth/loginGoogle',
            formData,
            {
                withCredentials: true
            }
        )
        return response.data;
    }
)

export const logoutUser = createAsyncThunk(
    '/auth/logout',
    async () => {
        const response = await axios.post('http://localhost:3000/api/auth/logout', 
            {},
            {
                withCredentials: true
            }
        )
        return response.data;
    }
)

export const checkAuth = createAsyncThunk(
    '/auth/checkAuth',
    async () => {
        const response = await axios.get('http://localhost:3000/api/auth/check-auth', 
            {
                withCredentials: true,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
                }
            }
        )
        return response.data;
    }
)
const NullUser = {
    userId: "",
    email: "",
    fullName: "",
    avatar: "",
    roles: []
}
const AdminAuthSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.isLoading = false;
                state.user = NullUser;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = NullUser;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<FetchUserResponse>) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : NullUser;
                state.isAuthenticated = action.payload.success ? true : false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = NullUser;
                state.isAuthenticated = false;
            }) 
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<FetchUserResponse>) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : NullUser;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = NullUser;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = NullUser;
                state.isAuthenticated = false;
            })
    }
})

export default AdminAuthSlice.reducer;