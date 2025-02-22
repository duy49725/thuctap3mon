import { Product, ProductResponse } from "@/config/entity";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ShoppingProductState {
    isLoading: boolean,
    productList: ProductResponse[],
    allProduct: ProductResponse[],
    productDetail: ProductResponse;
    totalProduct: number;
}

const initializeResponse: ProductResponse = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: '',
    image: '',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [
        {
            id: 0,
            name: '',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ],
    promotions: [
        {
            id: 0,
            name: '',
            description: '',
            discountAmount: 0,
            discountType: '',
            startDate: new Date(),
            endDate: new Date(),
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],
    fruitType: {
        id: 0,
        name: '',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    finalPrice: 0
}

interface ShoppingProductResponse {
    success: false,
    data: ProductResponse[],
    pagination: {
        page: number,
        limit: number,
        totalProduct: number
    }
}

interface ShoppingProductDetailResponse{
    success: boolean,
    data: ProductResponse
}

const initialState: ShoppingProductState = {
    isLoading: false,
    productList: [],
    allProduct: [],
    productDetail: initializeResponse,
    totalProduct: 0
}

interface fetchAllShoppingProductsParams {
    search: string,
    category: string[],
    fruitType: string[],
    minPrice: string,
    maxPrice: string,
    sort: string,
    page: number,
    limit: number
}

export const fetchAllShoppingProducts = createAsyncThunk(
    "/product/fetchAllShoppingProducts",
    async (params: Partial<fetchAllShoppingProductsParams> = {}) => {
        const query = new URLSearchParams();

        if (params.search !== undefined) query.append("search", params.search);
        if (params.category && params.category.length > 0) query.append("category", params.category.join(","));
        if (params.fruitType && params.fruitType.length > 0) query.append("fruitType", params.fruitType.join(","));
        if (params.minPrice !== undefined) query.append("minPrice", params.minPrice.toString());
        if (params.maxPrice !== undefined) query.append("maxPrice", params.maxPrice.toString());
        if (params.sort) query.append("sort", params.sort);
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());

        const result = await axios.get(`http://localhost:3000/api/shopping/product/get?${query.toString()}`);
        return result.data;
    }
);

export const fetchAllProducts = createAsyncThunk(
    "/product/fetchAllProducts",
    async () => {
        const result = await axios.get(`http://localhost:3000/api/shopping/product/get`);
        return result.data;
    }
);


export const fetchShoppingProductDetail = createAsyncThunk(
    "/product/shoppingProductDetail",
    async (id) => {
        const result = await axios.get(`http://localhost:3000/api/shopping/product/getDetail/${id}`);
        return result.data;
    }
)

const shopProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetail = initializeResponse
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllShoppingProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllShoppingProducts.fulfilled, (state, action: PayloadAction<ShoppingProductResponse>) => {
                state.isLoading = false;
                state.productList = action.payload.data;
                state.totalProduct = action.payload.pagination.totalProduct;
            })
            .addCase(fetchAllShoppingProducts.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            })
            .addCase(fetchShoppingProductDetail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchShoppingProductDetail.fulfilled, (state, action: PayloadAction<ShoppingProductDetailResponse>) => {
                state.isLoading = false;
                state.productDetail = action.payload.data;
            })
            .addCase(fetchShoppingProductDetail.rejected, (state) => {
                state.isLoading = false;
                state.allProduct = []
            })
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<ShoppingProductResponse>) => {
                state.isLoading = false;
                state.allProduct = action.payload.data;
            })
            .addCase(fetchAllProducts.rejected, (state) => {
                state.isLoading = false;
                state.allProduct = []
            })
    }
})

export const {setProductDetails} = shopProductSlice.actions;
export default shopProductSlice.reducer;