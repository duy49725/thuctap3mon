export interface Product {
  id: number;
  name: string;
  fruitType_id: number | null;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  isActive: boolean | number;
  category_id: number[];
  promotion_id: number[];
  productImages: {id: number, product_id: number, image: string}[];
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image: string,
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: [
    {
      id: number;
      name: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ]
  promotions:
  {
    id: number;
    name: string;
    description: string;
    discountAmount: number;
    discountType: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[]
  fruitType: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  },
  finalPrice: number;
  productImages: {id: number, product_id: number, image: string}[];
}

export interface Role {
  id: number,
  roleName: string;
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  avatar: string;
  roles: Role[],
}


export interface UserFormData {
  email: string;
  password: string;
  fullName: string;
}

export interface FeatureImage {
  id: number;
  image: string;
}

export interface FeatureImageResponse {
  success: boolean;
  data: FeatureImage[];
}

export interface DiscountCode {
  id: number;
  code: string;
  amount: number;
  type: string;
  minOrderValue: number;
  maxUser: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface UserToManage {
  id: string;
  email: string;
  password: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  isActive: boolean;
  roles_Id: number[];
}

export interface UserToManageResponse {
  id: string;
  email: string;
  password: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  isActive: boolean;
  roles: Role[];
}

export interface ShippingAddress {
  id: number;
  user_id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  phoneNumber: number;
  note: string;
}

export interface Order {
  id: number;
  userId: string;
  cartId: number;
  discountCodeId: number;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  shippingAddressId: number | undefined;
  paymentMethod: string;
  orderDate: Date;
  orderUpdateDate: Date;
  paymentStatus: string;
  paymentId: string;
  payerId: string;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unitPrice: number;
}

export interface userOrderDetail {
  id: number;
  quantity: number;
  unitPrice: number;
  product: Product
}

export interface userOrderResponse {
  id: number;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  orderDate: Date;
  orderUpdateDate: Date;
  paymentStatus: string;
  paymentId: string;
  payerId: string;
  user: User;
  discountCode: DiscountCode;
  shippingAddress: ShippingAddress;
  orderDetails: userOrderDetail[]
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    avatar: string;
  };
  images: ReviewImage[];
  replies: ReviewReply[];
}

export interface ReviewImage {
  id: number;
  imageUrl: string;
  caption: string | null;
}

export interface ReviewReply {
  id: number;
  replyText: string;
  isFromSeller: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    avatar: string;
  };
}

export interface ReviewStatistics {
  id: number;
  avgRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ReviewState {
  reviewDontApprove: {
    reviews: {
      id: number;
      rating: number;
      comment: string;
      isApproved: boolean;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        email: string;
        fullName: string;
        avatar: string;
      };
      product: {
        id: number;
        name: string;
        description: string;
        price: number;
        quantity: number;
        unit: string;
        image: string;
      }
    }[],
    loading: boolean,
    error: string | null
  },
  productReviews: {
    reviews: Review[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    loading: boolean;
    error: string | null;
  };
  userReviews: {
    reviews: Review[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    loading: boolean;
    error: string | null;
  };
  reviewStatistics: {
    data: ReviewStatistics | null;
    loading: boolean;
    error: string | null;
  };
  createReview: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  reviewReply: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  adminApproval: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
  pendingOrdersToReview: {
    orders: any[];
    loading: boolean;
    error: string | null;
  };
}