import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/config/entity";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllFruitType } from "@/store/admin/fruitType-slice";
import { fetchAllPromotion } from "@/store/admin/promotion-slice";
import MultiSelect from 'react-select';
import { Label } from "@/components/ui/label";
import { fetchAllCategory } from "@/store/admin/category-slice";
import ImageUpload from "../image-upload";

interface AddProductFormProps {
    onAdd: (product: Omit<Product, 'id'>) => void;
}

export const productInitial: Omit<Product, 'id'> = {
    name: '',
    fruitType_id: 1,
    description: '',
    price: 0,
    quantity: 0,
    unit: '',
    image: '',
    isActive: false,
    category_id: [],
    promotion_id: []
}

const AddProductForm = ({ onAdd }: AddProductFormProps) => {
    const [product, setProduct] = useState<Omit<Product, 'id'>>(productInitial);
    const dispatch = useDispatch<AppDispatch>();
    const { fruitTypeList, totalFruitTypes } = useSelector((state: RootState) => state.adminFruitType);
    const { promotionList, totalPromotions } = useSelector((state: RootState) => state.adminPromotion);
    const { categoryList, totalCategories } = useSelector((state: RootState) => state.adminCategory);
    const [promotionOptions, setPromotionOptions] = useState<Array<{ value: number, label: string }>>([]);
    const [selectedPromotions, setSelectedPromotions] = useState<Array<{ value: number, label: string }>>([]);
    const [categoriesOptions, setCategoriesOptions] = useState<Array<{ value: number, label: string }>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<{ value: number, label: string }>>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
    useEffect(() => {
        dispatch(fetchAllFruitType({ page: 1, limit: totalFruitTypes }))
        dispatch(fetchAllPromotion({ page: 1, limit: totalPromotions }))
        dispatch(fetchAllCategory({ page: 1, limit: totalCategories }))
    }, [dispatch])
    useEffect(() => {
        if (promotionList.length > 0) {
            const options = promotionList.map((item) => ({
                value: item.id,
                label: item.name
            }));
            setPromotionOptions(options);
        }
    }, [promotionList])
    useEffect(() => {
        if (categoryList.length > 0) {
            const options = categoryList.map((item) => ({
                value: item.id,
                label: item.name
            }))
            setCategoriesOptions(options);
        }
    }, [categoryList])
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
       /* const formData: any = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', String(product.price));
        formData.append('quantity', String(product.quantity));
        formData.append('unit', product.unit);
        formData.append('isActive', product.isActive ? '1' : '0'); 
        formData.append('fruitType_id', String(product.fruitType_id));
        product.category_id.forEach(categoryId => formData.append('category_id[]', String(categoryId)));
        product.promotion_id.forEach(promotionId => formData.append('promotion_id[]', String(promotionId)));
        if (product.image) {
            formData.append('image', uploadedImageUrl);
        }*/
        onAdd({...product, image: uploadedImageUrl});
        setProduct(productInitial);
    }
    
    return (
        <form className="w-[500px]" onSubmit={handleSubmit} encType="multipart/form-data">
            <Label>Product Name</Label>
            <Input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="Enter Product Name"
                className="mb-4"
            />
            <Label>Description</Label>
            <Textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                placeholder="Enter Product Description"
                className="mb-4"
            />
            <Label>Product Price</Label>
            <Input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                className="mb-4"
            />
            <Label>Product Quantity</Label>
            <Input
                type="number"
                value={product.quantity}
                onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                className="mb-4"
            />
            <Label>Product Unit</Label>
            <Input
                type="text"
                value={product.unit}
                onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                placeholder="Enter Product Unit"
                className="mb-4"
            />
            <Label>Choose Product Image</Label>
            {/*<Input
                type="file"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setProduct({ ...product, image: e.target.files[0] });
                    }
                }}
                className="mb-4"
            />*/}
            <ImageUpload 
                imageFile={imageFile}
                setImageFile={setImageFile}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
            />
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="terms2" onCheckedChange={(checked) => setProduct({ ...product, isActive: Boolean(checked) })} />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Promotion Active
                </label>
            </div>
            <Label>Select Fruit Type</Label>
            <Select
                onValueChange={(value) => setProduct({ ...product, fruitType_id: Number(value) })}
                value={String(product.fruitType_id)}
            >
                <SelectTrigger className="w-full, mb-4">
                    <SelectValue placeholder={fruitTypeList.map((fruitType) => fruitType.id == product.fruitType_id ? fruitType.name : null)} />
                </SelectTrigger>
                <SelectContent>
                    {
                        fruitTypeList && fruitTypeList.length > 0
                            ? fruitTypeList.map((fruitType) => (
                                <SelectItem key={fruitType.id} value={String(fruitType.id)}>
                                    {fruitType.name}
                                </SelectItem>
                            )) : null
                    }
                </SelectContent>
            </Select>
            <Label>Select Promotion Program</Label>
            <MultiSelect
                isMulti
                value={selectedPromotions}
                options={promotionOptions}
                onChange={(selectedOptions) => {
                    setSelectedPromotions([...selectedOptions])
                    setProduct({ ...product, promotion_id: selectedOptions.map(promotion => promotion.value) })
                }}
                styles={{
                    container: (provided) => ({ ...provided, width: '100%', marginBottom: '1rem' }),
                }}
            />
            <Label>Select Category</Label>
            <MultiSelect
                isMulti
                value={selectedCategories}
                options={categoriesOptions}
                onChange={(selectedOptions) => {
                    setSelectedCategories([...selectedOptions])
                    setProduct({ ...product, category_id: selectedOptions.map(category => category.value) })
                }}
                styles={{
                    container: (provided) => ({ ...provided, width: '100%', marginBottom: '1rem' }),
                }}
            />
            <Button className="w-full">Add Product</Button>
        </form>
    )
}

export default AddProductForm;