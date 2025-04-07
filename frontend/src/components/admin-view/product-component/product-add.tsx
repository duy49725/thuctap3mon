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
import MultipleImageUpload from '@/common/uploadMultiIImage';

interface AddProductFormProps {
    onAdd: (data: { product: Omit<Product, 'id'>; images: string[] }) => void;
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
    promotion_id: [],
    productImages: []
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
    const [images, setImages] = useState<{imageUrl: string}[]>([]);
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
        const updatedProduct = { ...product, image: uploadedImageUrl };
        const imageUrls = images.map((img) => img.imageUrl);
        onAdd({ product: updatedProduct, images: imageUrls });
        setProduct(productInitial);
        setSelectedPromotions([]);
        setSelectedCategories([]);
        setUploadedImageUrl('');
        setImages([]);
        setImageFile(null);
    };
    const handleImageUpload = (newImages: {imageUrl: string;}[]) => {
        setImages([...images, ...newImages]);
    }
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    }
    console.log(images);
    return (
        <form className="w-[700px]" onSubmit={handleSubmit} encType="multipart/form-data">
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
            <div className="flex justify-between gap-2 items-center">
                <div>
                    <Label>Product Price</Label>
                    <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                        className="mb-4"
                    />
                </div>
                <div>
                    <Label>Product Quantity</Label>
                    <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
                        className="mb-4"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="w-[200px] h-[50px]">
                    <Label>Product Unit</Label>
                    <Select
                        onValueChange={(value) => setProduct({ ...product, unit: value })}
                        value={product.unit}
                    >
                        <SelectTrigger className="w-full, mb-4">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kg">
                                Kg
                            </SelectItem>
                            <SelectItem value="piece">
                                Piece
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[200px] h-[50px]">
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
                </div>
            </div>
            <div className={`flex items-center justify-between ${uploadedImageUrl ? 'gap-5' : ''}`}>
                <ImageUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    setUploadedImageUrl={setUploadedImageUrl}
                    imageLoadingState={imageLoadingState}
                    setImageLoadingState={setImageLoadingState}
                />
                {
                    uploadedImageUrl && <img  className="w-24 h-24 mt-6" src={uploadedImageUrl} alt="" />
                }
            </div>
            <div className="space-y-2">
                <Label>Add Orther Photos (optional)</Label>
                <MultipleImageUpload 
                    onImageUpload={handleImageUpload}
                    maxImages={5}
                />
                {
                    images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {
                                images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img className="w-24 h-24 mt-6" src={image.imageUrl} alt="" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
            <div className="flex items-center space-x-2 mt-4 mb-2">
                <Checkbox id="terms2" onCheckedChange={(checked) => setProduct({ ...product, isActive: Boolean(checked) })} />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Is Active
                </label>
            </div>
            <div className="flex justify-between items-center gap-10">
                <div className="w-[50%]">
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
                </div>
                <div className="w-[50%]">
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
                </div>
            </div>
            <Button className="w-full">Add Product</Button>
        </form>
    )
}

export default AddProductForm;