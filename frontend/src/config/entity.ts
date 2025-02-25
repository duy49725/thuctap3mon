export interface Product {
    id: number;
    name: string;
    fruitType_id: number;
    description: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
    isActive: boolean | number;
    category_id: number[];
    promotion_id: number[];
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

export interface UserToManage{
    id: string;
    email: string;
    password: string;
    fullName: string;
    avatar: string;
    isVerified: boolean;
    isActive: boolean;
    roles_Id: number[];
}

export interface UserToManageResponse{
    id: string;
    email: string;
    password: string;
    fullName: string;
    avatar: string;
    isVerified: boolean;
    isActive: boolean;
    roles: Role[];
}

export interface ShippingAddress{
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

export interface Order{
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

export interface OrderDetail{
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unitPrice: number;
}