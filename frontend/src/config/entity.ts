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
    id: string,
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