import { useSearchParams } from "react-router-dom";
import ProductFilter from '@/components/shopping-view/filter';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sortOptions } from '@/config';
import { fetchAllShoppingProducts } from '@/store/shopping/product-slice';
import { AppDispatch, RootState } from '@/store/store';
import { ArrowUpDownIcon, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ShoppingListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productList, totalProduct } = useSelector((state: RootState) => state.shopProduct);
  const [limit, setLimit] = useState<number>(8);
  const [searchInput, setSearchInput] = useState<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const handleSort = (value: string) => {
    setSearchParams(prev => {
      prev.set("sort", value);
      return prev;
    });
  };

  useEffect(() => {
    const category = searchParams.get("category")?.split(",") || [];
    const fruitType = searchParams.get("fruitType")?.split(",") || [];
    dispatch(fetchAllShoppingProducts({ page: 1, limit, search, sort, category, fruitType, minPrice, maxPrice }));
  }, [dispatch, limit, search, sort, searchParams]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6'>
      <ProductFilter />
      <div className='bg-background w-full rounded-lg shadow-sm'>
        <div className='p-2 border-b flex items-center justify-between'>
          <h2 className='text-lg font-extrabold'>All Product</h2>
          <div className='rounded-lg w-[50%] flex items-center justify-between border-2 border-slate-900 p-2'>
            <input
              type='text'
              className='border-0 outline-none w-full bg-none'
              defaultValue={search}
              onChange={(e) => {
                setSearchInput(e.target.value)
              }}
            />
            <Search onClick={() => {
                setSearchParams(prev => {
                  prev.set("search", String(searchInput));
                  return prev;
                });
            }} size={25} className='cursor-pointer hover:text-orange-700' />
          </div> 
          <div className='flex items-center gap-3'>
            <span className='text-muted-foreground'>{productList.length} product</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <ArrowUpDownIcon className='h-4 w-4' />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w[200px]'>
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem
                    key={sortItem.id}
                    value={sortItem.id}
                    onSelect={() => handleSort(sortItem.id)}
                  >
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {productList.length > 0
            ? productList.map((productItem) => <ShoppingProductTile product={productItem} key={productItem.id} />)
            : <p className="text-center">No products found.</p>
          }
        </div>
        {limit < totalProduct && (
          <p
            className='text-center mt-2 w-full cursor-pointer hover:opacity-55'
            onClick={() => setLimit((prev) => prev + 4)}
          >
            Show more {Math.max(totalProduct - limit, 0)} results
          </p>
        )}
      </div>
    </div>
  );
};

export default ShoppingListing;
