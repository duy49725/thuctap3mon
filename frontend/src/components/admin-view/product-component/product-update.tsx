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
import MultipleImageUpload from '@/common/uploadMultiIImage';
import { fetchAllProductImage } from "@/store/admin/product-slice";

interface EditProductFormProps {
    product: Product;
    onSave: (data: { id: number; product: Omit<Product, 'id'>; images: string[] }) => void;
}

const UpdateProductForm = ({ product, onSave }: EditProductFormProps) => {
    const [productForm, setProductForm] = useState<Product>(product);
    const dispatch = useDispatch<AppDispatch>();
    const { fruitTypeList, totalFruitTypes } = useSelector((state: RootState) => state.adminFruitType);
    const { promotionList, totalPromotions } = useSelector((state: RootState) => state.adminPromotion);
    const { categoryList, totalCategories } = useSelector((state: RootState) => state.adminCategory);
    const { productImages } = useSelector((state: RootState) => state.adminProduct);
    const [promotionOptions, setPromotionOptions] = useState<Array<{ value: number; label: string }>>([]);
    const [selectedPromotions, setSelectedPromotions] = useState<Array<{ value: number; label: string }>>(
        promotionList?.length > 0
            ? promotionList.filter(item => product.promotion_id.includes(item.id)).map(item => ({ value: item.id, label: item.name }))
            : []
    );
    const [categoriesOptions, setCategoriesOptions] = useState<Array<{ value: number; label: string }>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<{ value: number; label: string }>>(
        categoryList?.length > 0
            ? categoryList.filter(item => product.category_id.includes(item.id)).map((item) => ({ value: item.id, label: item.name }))
            : []
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(product.image || '');
    const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
    const [images, setImages] = useState<{ imageUrl: string }[]>(product.productImages?.map(img => ({ imageUrl: img.image })) || []);

    useEffect(() => {
        dispatch(fetchAllFruitType({ page: 1, limit: totalFruitTypes }));
        dispatch(fetchAllPromotion({ page: 1, limit: totalPromotions }));
        dispatch(fetchAllCategory({ page: 1, limit: totalCategories }));
        dispatch(fetchAllProductImage());
    }, [dispatch]);

    useEffect(() => {
        if (promotionList.length > 0) {
            const options = promotionList.map((item) => ({
                value: item?.id,
                label: item?.name,
            }));
            setPromotionOptions(options);
        }
    }, [promotionList]);

    useEffect(() => {
        if (categoryList.length > 0) {
            const options = categoryList.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setCategoriesOptions(options);
        }
    }, [categoryList]);

    useEffect(() => {
        setProductForm(product);
        setUploadedImageUrl(product.image || '');
        setImages(product.productImages?.map(img => ({ imageUrl: img.image })) || []);
        setSelectedPromotions(
            promotionList?.length > 0
                ? promotionList.filter(item => product.promotion_id.includes(item.id)).map(item => ({ value: item.id, label: item.name }))
                : []
        );
        setSelectedCategories(
            categoryList?.length > 0
                ? categoryList.filter(item => product.category_id.includes(item.id)).map((item) => ({ value: item.id, label: item.name }))
                : []
        );
    }, [product, promotionList, categoryList]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProduct = { ...productForm, image: uploadedImageUrl || productForm.image };
        const imageUrls = images.map((img) => img.imageUrl);
        onSave({ id: product.id, product: updatedProduct, images: imageUrls });
        setImageFile(null);
        setUploadedImageUrl('');
        setImages([]);
    };

    const handleImageUpload = (newImages: { imageUrl: string }[]) => {
        setImages([...images, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <form className="w-[700px]" onSubmit={handleSubmit} encType="multipart/form-data">
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
            <div className="flex justify-between gap-2 items-center">
                <div>
                    <Label>Product Price</Label>
                    <Input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="mb-4"
                    />
                </div>
                <div>
                    <Label>Product Quantity</Label>
                    <Input
                        type="number"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: Number(e.target.value) })}
                        className="mb-4"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="w-[200px] h-[50px]">
                    <Label>Product Unit</Label>
                    <Select
                        onValueChange={(value) => setProductForm({ ...productForm, unit: value })}
                        value={productForm.unit}
                    >
                        <SelectTrigger className="w-full, mb-4">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="piece">Piece</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[200px] h-[50px]">
                    <Label>Select Fruit Type</Label>
                    <Select
                        onValueChange={(value) => setProductForm({ ...productForm, fruitType_id: Number(value) })}
                        value={String(productForm?.fruitType_id) || undefined}
                    >
                        <SelectTrigger className="w-full, mb-4">
                            <SelectValue placeholder={fruitTypeList?.map((fruitType) => fruitType?.id == product?.fruitType_id ? fruitType?.name : null)} />
                        </SelectTrigger>
                        <SelectContent>
                            {fruitTypeList && fruitTypeList.length > 0 ? (
                                fruitTypeList.map((fruitType) => (
                                    <SelectItem key={fruitType?.id} value={String(fruitType?.id)}>
                                        {fruitType?.name}
                                    </SelectItem>
                                ))
                            ) : null}
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
                {uploadedImageUrl && <img className="w-24 h-24 mt-6" src={uploadedImageUrl} alt="" />}
            </div>
            <div className="space-y-2">
                <Label>Add Other Photos (optional)</Label>
                <MultipleImageUpload 
                    onImageUpload={handleImageUpload}
                    maxImages={5}
                />
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img className="w-24 h-24 mt-6" src={image.imageUrl} alt="" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 mt-4 mb-2">
                <Checkbox
                    checked={Boolean(productForm.isActive)}
                    id="productActive"
                    onCheckedChange={(checked) => setProductForm({ ...productForm, isActive: Boolean(checked) })}
                />
                <label
                    htmlFor="productActive"
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
                            setSelectedPromotions([...selectedOptions]);
                            setProductForm({ ...productForm, promotion_id: selectedOptions.map(promotion => promotion.value) });
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
                            setSelectedCategories([...selectedOptions]);
                            setProductForm({ ...productForm, category_id: selectedOptions.map(category => category.value) });
                        }}
                        styles={{
                            container: (provided) => ({ ...provided, width: '100%', marginBottom: '1rem' }),
                        }}
                    />
                </div>
            </div>
            <Button className="w-full">Update Product</Button>
        </form>
    );
};

export default UpdateProductForm;