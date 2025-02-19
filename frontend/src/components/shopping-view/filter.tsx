import { fetchAllCategory } from '@/store/admin/category-slice'
import { fetchAllFruitType } from '@/store/admin/fruitType-slice'
import { AppDispatch, RootState } from '@/store/store'
import React, { Fragment, use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { useSearchParams } from 'react-router-dom'
import { Slider } from '../ui/slider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'

interface PriceOption {
    label: string;
    minPrice?: number;
    maxPrice?: number;
}

const priceOptions: PriceOption[] = [
    { label: "Dưới 50k", minPrice: 0, maxPrice: 50 },
    { label: "50K - 100k", minPrice: 50, maxPrice: 100 },
    { label: "Tren 100", minPrice: 100, maxPrice: 1000 },
];

const ProductFilter = () => {
    const { categoryList, totalCategories } = useSelector((state: RootState) => state.adminCategory)
    const { fruitTypeList, totalFruitTypes } = useSelector((state: RootState) => state.adminFruitType);
    const [limitCategory, setLimitCategory] = useState<number>(8);
    const [limitFruitType, setLimitFruitType] = useState<number>(8);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedFruitType, setSelectedFruitType] = useState<number[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(null);

    const handleCheckboxChange = (id: number, type: "category" | "fruitType") => {
        if (type === "category") {
            setSelectedCategories(prev =>
                prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
            );
        } else {
            setSelectedFruitType(prev =>
                prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
            );
        }
    };

    useEffect(() => {
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        const foundOption = priceOptions.find(
            (option) =>
                (option.minPrice?.toString() === minPrice || option.minPrice === undefined) &&
                (option.maxPrice?.toString() === maxPrice || option.maxPrice === undefined)
        );

        setSelectedPrice(foundOption || priceOptions[0]);
    }, [searchParams]);

    const handleSelect = (option: PriceOption) => {
        setSelectedPrice(option);

        const newParams = new URLSearchParams(searchParams);
        if (option.minPrice !== undefined) {
            newParams.set("minPrice", option.minPrice.toString());
        } else {
            newParams.delete("minPrice");
        }

        if (option.maxPrice !== undefined) {
            newParams.set("maxPrice", option.maxPrice.toString());
        } else {
            newParams.delete("maxPrice");
        }

        setSearchParams(newParams);
    };

    useEffect(() => {
        setSearchParams(prev => {
            if (selectedCategories.length > 0) {
                prev.set("category", selectedCategories.join(","));
            } else {
                prev.delete("category");
            }

            if (selectedFruitType.length > 0) {
                prev.set("fruitType", selectedFruitType.join(","));
            } else {
                prev.delete("fruitType");
            }

            return prev;
        });
    }, [selectedCategories, selectedFruitType]);
    useEffect(() => {
        dispatch(fetchAllCategory({ page: 1, limit: limitCategory }))
    }, [limitCategory, dispatch])
    useEffect(() => {
        dispatch(fetchAllFruitType({ page: 1, limit: limitFruitType }))
    }, [limitFruitType, dispatch])

    const A = [1,2,3];
    console.log(A);
    const B = A;
    B[1] = 9;
    console.log(A);
    return (
        <div className='bg-background rounded-lg shadow-sm'>
            <div className='p-4 border-b'>
                <h2 className='text-lg font-extrabold'>Filter</h2>
            </div>
            <div className='p-4 space-y-4'>
                <div>
                    <h3 className='text-base font-bold'>Category</h3>
                    <div className='grid gap-2 mt-2'>
                        {categoryList.map(category => (
                            <Label key={category.id} className='flex items-center gap-2'>
                                <Checkbox
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={() => handleCheckboxChange(category.id, "category")}
                                />
                                {category.name}
                            </Label>
                        ))}
                    </div>
                    {limitCategory < totalCategories &&
                        <p className='cursor-pointer' onClick={() => {
                            setLimitCategory((prev) => {
                                const newLimitCategory = prev + 8
                                dispatch(fetchAllCategory({ page: 1, limit: newLimitCategory }))
                                return newLimitCategory;
                            })

                        }}>show more</p>}
                </div>
                <Separator />
                <div>
                    <h3 className='text-base font-bold'>Fruit Type</h3>
                    <div className='grid gap-2 mt-2'>
                        {fruitTypeList.map(fruitType => (
                            <Label key={fruitType.id} className='flex items-center gap-2'>
                                <Checkbox
                                    checked={selectedFruitType.includes(fruitType.id)}
                                    onCheckedChange={() => handleCheckboxChange(fruitType.id, "fruitType")}
                                />
                                {fruitType.name}
                            </Label>
                        ))}
                    </div>
                    {limitFruitType < totalFruitTypes &&
                        <p className='cursor-pointer' onClick={() =>
                            setLimitFruitType((prev) => {
                                const newLimitFruitType = prev + 8
                                dispatch(fetchAllFruitType({ page: 1, limit: newLimitFruitType }))
                                return newLimitFruitType;
                            })
                        }>show more</p>}
                </div>
                <div className="p-4 border rounded-lg w-full">
                    <h3 className="text-sm font-semibold mb-2">Chọn khoảng giá</h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className='w-[200px]'>
                                {selectedPrice ? selectedPrice.label : "Chọn khoảng giá"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {priceOptions.map((option) => (
                                <DropdownMenuItem key={option.label} onClick={() => handleSelect(option)} className='w-[200px]'>
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div >
    )
}

export default ProductFilter;