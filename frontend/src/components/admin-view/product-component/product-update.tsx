import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/config/entity";
import { Checkbox } from "@/components/ui/checkbox";
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

interface EditProductFormProps {
    product: Product,
    onSave: (id: number, data: Omit<Product, 'id'>) => void
}

const UpdateProductForm = ({ product, onSave }: EditProductFormProps) => {
    const [productForm, setProductForm] = useState<Product>(product);
    useEffect(() => {
        setProductForm(product);
    }, [product])
    console.log(product);
    console.log(productForm, 'productform');
    const dispatch = useDispatch<AppDispatch>();
    const { fruitTypeList, totalFruitTypes } = useSelector((state: RootState) => state.adminFruitType);
    const { promotionList, totalPromotions } = useSelector((state: RootState) => state.adminPromotion);
    const { categoryList, totalCategories } = useSelector((state: RootState) => state.adminCategory);
    const [promotionOptions, setPromotionOptions] = useState<Array<{ value: number, label: string }>>([]);
    const [selectedPromotions, setSelectedPromotions] = useState<Array<{ value: number, label: string }>>(
        promotionList?.length > 0
            ? promotionList.filter(item => product.promotion_id.includes(item.id)).map(item => ({ value: item.id, label: item.name }))
            : []
    );
    const [categoriesOptions, setCategoriesOptions] = useState<Array<{ value: number, label: string }>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<{ value: number, label: string }>>(
        categoryList?.length > 0
            ? categoryList.filter(item => product.category_id.includes(item.id)).map((item) => ({ value: item.id, label: item.name }))
            : []
    );
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
        /*const formData: any = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', String(productForm.price));
        formData.append('quantity', String(productForm.quantity));
        formData.append('unit', productForm.unit);
        formData.append('isActive', productForm.isActive ? '1' : '0'); 
        formData.append('fruitType_id', String(productForm.fruitType_id));
        productForm.category_id.forEach(categoryId => formData.append('category_id[]', String(categoryId)));
        productForm.promotion_id.forEach(promotionId => formData.append('promotion_id[]', String(promotionId)));
        if (productForm.image) {
            formData.append('image', productForm.image);
        }*/
        onSave(product.id, {...productForm, image: uploadedImageUrl})
    }
    return (
        <form className="w-[500px]" onSubmit={handleSubmit}>
            <Label>Product Name</Label>
            <Input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Enter Product Name"
                className="mb-4"
            />
            <Label>Description</Label>
            <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Enter Product Description"
                className="mb-4"
            />
            <Label>Product Price</Label>
            <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                className="mb-4"
            />
            <Label>Product Quantity</Label>
            <Input
                type="number"
                value={productForm.quantity}
                onChange={(e) => setProductForm({ ...productForm, quantity: Number(e.target.value) })}
                className="mb-4"
            />
            <Label>Product Unit</Label>
            <Input
                type="text"
                value={productForm.unit}
                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                placeholder="Enter Product Unit"
                className="mb-4"
            />
            <Label>Choose Product Image</Label>
            {/*<Input
                type="file"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setProductForm({ ...productForm, image: e.target.files[0] });
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
                <Checkbox checked={Boolean(productForm.isActive)} id="productActive" onCheckedChange={(checked) => setProductForm({ ...productForm, isActive: Boolean(checked) })} />
                <label htmlFor="productActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Is Active</label>
            </div>
            <Label>Select Fruit Type</Label>
            <Select
                onValueChange={(value) => setProductForm({ ...productForm, fruitType_id: Number(value) })}
                value={String(productForm.fruitType_id)}
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
                    setProductForm({ ...productForm, promotion_id: selectedOptions.map(promotion => promotion.value) })
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
                    setProductForm({ ...productForm, category_id: selectedOptions.map(category => category.value) })
                }}
                styles={{
                    container: (provided) => ({ ...provided, width: '100%', marginBottom: '1rem' }),
                }}
            />
            <Button className="w-full">Update Product</Button>
        </form>
    )
}

export default UpdateProductForm;