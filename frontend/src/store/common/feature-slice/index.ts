import { FeatureImage, FeatureImageResponse } from "@/config/entity";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface CommonFeatureState{
    isLoading: boolean;
    featureImageList: FeatureImage[];
}

const initialState: CommonFeatureState = {
    isLoading: false,
    featureImageList: []
}

export const addNewFeatureImage = createAsyncThunk(
    "/feature/addNewFeatureImage",
    async(formData: {image: string}) => {
        const result = await axios.post('http://localhost:3000/api/feature/add',
            formData,
            {
                headers: {
                     "Content-Type": "application/json"
                }
            }
        )
        return result?.data;
    }
)

export const fetchAllFeatureImage = createAsyncThunk(
    "/feature/fetchAllFeatureImage",
    async() => {
        try {
            const result = await axios.get('http://localhost:3000/api/feature/get');
            return result.data;
        } catch (error: any) {
            console.log(error)
        }
    }
)

export const deleteFeatureImage = createAsyncThunk(
    "/feature/deleteFeatureImage",
    async(id: number) =>{
        const result = await axios.delete(`http://localhost:3000/api/feature/delete/${id}`);
        return result.data;
    }
)

const CommonFeatureSlice = createSlice({
    name: "commonFeatureImage",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFeatureImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFeatureImage.fulfilled, (state, action: PayloadAction<FeatureImageResponse>) => {
                state.isLoading = false;
                state.featureImageList = action.payload.data;
            })
            .addCase(fetchAllFeatureImage.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            })
    }
})

export default CommonFeatureSlice.reducer;