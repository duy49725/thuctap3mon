import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Review, ReviewState, ReviewStatistics } from '@/config/entity';
import { createSlice } from '@reduxjs/toolkit';
const API_URL = 'http://localhost:3000/api/shopping/review';

export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchProductReviews',
    async ({ productId, page = 1, limit = 10 }: { productId: number | undefined, page?: number, limit?: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get/${productId}?page=${page}&limit=${limit}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

export const fetchDontApproveReview = createAsyncThunk(
    'reviews/fetchDontApproveReview',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/getReviewNotApprove`);
            return response.data
        } catch (error) {
            console.log(error);
        }
    }
)

export const fetchProductReviewStats = createAsyncThunk(
    'reviews/fetchProductReviewStats',
    async (productId: number | null, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/product/${productId}/stats`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch review statistics');
        }
    }
);

export const fetchUserReviews = createAsyncThunk(
    'reviews/fetchUserReviews',
    async ({ page = 1, limit = 10 }: { page?: number, limit?: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/user?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reviews');
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (reviewData: {
        productId: number | undefined,
        rating: number,
        comment: string,
        images?: { imageUrl: string }[]
    }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/add`, reviewData, {
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const addReviewReply = createAsyncThunk(
    'reviews/addReviewReply',
    async ({ reviewId, replyText }: { reviewId: number, replyText: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/addReply/${reviewId}`, { replyText },
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add reply');
        }
    }
);

export const approveReview = createAsyncThunk(
    'reviews/approveReview',
    async ({reviewId, isApproved}:{reviewId: number, isApproved: boolean}, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/approve/${reviewId}`, {isApproved: isApproved},{
                withCredentials: true
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve review');
        }
    }
);

export const fetchPendingOrdersToReview = createAsyncThunk(
    'reviews/fetchPendingOrdersToReview',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/orders/pending-review');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders pending review');
        }
    }
);


const initialState: ReviewState = {
    reviewDontApprove: {
        reviews: [],
        loading: false,
        error: null
    },
    productReviews: {
        reviews: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        },
        loading: false,
        error: null
    },
    userReviews: {
        reviews: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        },
        loading: false,
        error: null
    },
    reviewStatistics: {
        data: null,
        loading: false,
        error: null
    },
    createReview: {
        loading: false,
        success: false,
        error: null
    },
    reviewReply: {
        loading: false,
        success: false,
        error: null
    },
    adminApproval: {
        loading: false,
        success: false,
        error: null
    },
    pendingOrdersToReview: {
        orders: [],
        loading: false,
        error: null
    }
};

const reviewSlice = createSlice({
    name: 'userReviewsSlice',
    initialState,
    reducers: {
        resetCreateReviewState: (state) => {
            state.createReview = {
                loading: false,
                success: false,
                error: null
            };
        },
        resetReviewReplyState: (state) => {
            state.reviewReply = {
                loading: false,
                success: false,
                error: null
            };
        },
        resetAdminApprovalState: (state) => {
            state.adminApproval = {
                loading: false,
                success: false,
                error: null
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDontApproveReview.pending, (state, action) => {
                state.reviewDontApprove.loading = true;
            })
            .addCase(fetchDontApproveReview.fulfilled, (state, action) => {
                state.reviewDontApprove.loading = false
                state.reviewDontApprove.reviews = action.payload.data;
            })
            .addCase(fetchDontApproveReview.rejected, (state) => {
                state.reviewDontApprove.loading = false
                state.reviewDontApprove.reviews = [];
            })
        builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.productReviews.loading = true;
                state.productReviews.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.productReviews.loading = false;
                state.productReviews.reviews = action.payload.reviews;
                state.productReviews.pagination = action.payload.pagination;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.productReviews.loading = false;
                state.productReviews.error = action.payload as string;
            });

        builder
            .addCase(fetchProductReviewStats.pending, (state) => {
                state.reviewStatistics.loading = true;
                state.reviewStatistics.error = null;
            })
            .addCase(fetchProductReviewStats.fulfilled, (state, action) => {
                state.reviewStatistics.loading = false;
                state.reviewStatistics.data = action.payload;
            })
            .addCase(fetchProductReviewStats.rejected, (state, action) => {
                state.reviewStatistics.loading = false;
                state.reviewStatistics.error = action.payload as string;
            });

        builder
            .addCase(fetchUserReviews.pending, (state) => {
                state.userReviews.loading = true;
                state.userReviews.error = null;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.userReviews.loading = false;
                state.userReviews.reviews = action.payload.reviews;
                state.userReviews.pagination = action.payload.pagination;
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.userReviews.loading = false;
                state.userReviews.error = action.payload as string;
            });

        builder
            .addCase(createReview.pending, (state) => {
                state.createReview.loading = true;
                state.createReview.success = false;
                state.createReview.error = null;
            })
            .addCase(createReview.fulfilled, (state) => {
                state.createReview.loading = false;
                state.createReview.success = true;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.createReview.loading = false;
                state.createReview.error = action.payload as string;
            });

        builder
            .addCase(addReviewReply.pending, (state) => {
                state.reviewReply.loading = true;
                state.reviewReply.success = false;
                state.reviewReply.error = null;
            })
            .addCase(addReviewReply.fulfilled, (state) => {
                state.reviewReply.loading = false;
                state.reviewReply.success = true;
            })
            .addCase(addReviewReply.rejected, (state, action) => {
                state.reviewReply.loading = false;
                state.reviewReply.error = action.payload as string;
            });

        builder
            .addCase(approveReview.pending, (state) => {
                state.adminApproval.loading = true;
                state.adminApproval.success = false;
                state.adminApproval.error = null;
            })
            .addCase(approveReview.fulfilled, (state) => {
                state.adminApproval.loading = false;
                state.adminApproval.success = true;
            })
            .addCase(approveReview.rejected, (state, action) => {
                state.adminApproval.loading = false;
                state.adminApproval.error = action.payload as string;
            });

        builder
            .addCase(fetchPendingOrdersToReview.pending, (state) => {
                state.pendingOrdersToReview.loading = true;
                state.pendingOrdersToReview.error = null;
            })
            .addCase(fetchPendingOrdersToReview.fulfilled, (state, action) => {
                state.pendingOrdersToReview.loading = false;
                state.pendingOrdersToReview.orders = action.payload;
            })
            .addCase(fetchPendingOrdersToReview.rejected, (state, action) => {
                state.pendingOrdersToReview.loading = false;
                state.pendingOrdersToReview.error = action.payload as string;
            });
    }
});

export const {
    resetCreateReviewState,
    resetReviewReplyState,
    resetAdminApprovalState
} = reviewSlice.actions;

export default reviewSlice.reducer;