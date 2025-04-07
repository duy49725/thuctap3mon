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
    productImages: {id: number; productId: number, image: string}[]
}

const initialState: AdminProductState = {
    isLoading: false,
    productList: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    totalProduct: 0,
    productImages: []
}
interface AddProductPayload {
    product: Omit<Product, 'id'>; 
    images: string[]; 
}
interface EditProductPayload {
    id: number;
    product: Omit<Product, 'id'| 'productImages'>; 
    images: string[]; 
}
export const addNewProduct = createAsyncThunk(
    "/product/adNewProduct",
    async ({product, images}: AddProductPayload, { rejectWithValue }) => {
        try {
            const result = await axios.post("http://localhost:3000/api/admin/product/add",
                {...product, images},
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

export const fetchAllProductImage = createAsyncThunk(
    "/product/fetchAllProductImage",
    async() => {
        try {
            const result = await axios.get(`http://localhost:3000/api/admin/product/getProductImage`);
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }
)

export const editProduct = createAsyncThunk(
    "/product/editProduct",
    async ({ id, product, images }: EditProductPayload, { rejectWithValue }) => {
        try {
            const result = await axios.put(
                `http://localhost:3000/api/admin/product/update/${id}`,
                {...product, images},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return result.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

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
            .addCase(fetchAllProductImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllProductImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productImages = action.payload.data
            })
            .addCase(fetchAllProductImage.rejected, (state) => {
                state.isLoading = false;
                state.productImages = []
            })
    }
})

export default AdminProductSlice.reducer;