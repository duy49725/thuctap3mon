import React, { useEffect, useState } from 'react'
import { fetchAllFeatureImage } from '@/store/common/feature-slice';
import { fetchAllShoppingProducts, fetchShoppingProductDetail } from '@/store/shopping/product-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Apple, Banana, Cherry, ChevronLeft, ChevronLeftIcon, ChevronsRightIcon, Citrus, Grape, Vegan } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ShoppingProductTile from '@/components/shopping-view/product-tile';

const fruitTypeWithIcon = [
  { id: "citrus", label: "Citrus", icon: Citrus },
  { id: "apple", label: "Apple", icon: Apple },
  { id: "banana", label: "Banana", icon: Banana },
  { id: "cherry", label: "Cherry", icon: Cherry },
  { id: "grape", label: "Grape", icon: Grape },
  { id: "vegan", label: "Vegan", icon: Vegan },
]
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { productList, totalProduct } = useSelector((state: RootState) => state.shopProduct);
  const { featureImageList } = useSelector((state: RootState) => state.commonFeature);
  const [limit, setLimit] = useState<number>(8);
  useEffect(() => {
    dispatch(fetchAllShoppingProducts({ page: 1, limit: limit }))
  }, [limit, dispatch])
  useEffect(() => {
    dispatch(fetchAllFeatureImage());
  }, [dispatch])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000)
    return () => clearInterval(timer);
  })
  console.log(totalProduct);
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[600px] overflow-hidden'>
        {
          featureImageList && featureImageList.length > 0
            ? featureImageList.map((slide, index) => (
              <img src={slide?.image} alt="" className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />
            )) : null
        }
        <Button
          variant='outline'
          size='icon'
          className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-white-80'
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
        >
          <ChevronLeftIcon className='w-4 h-4' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-white-80'
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)}
        >
          <ChevronsRightIcon className='w-4 h-4' />
        </Button>
      </div>
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop by Fruit Type</h2>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mx-24'>
          {
            fruitTypeWithIcon.map((fruitTypeItem) => (
              <Card>
                <CardContent className='flex flex-col items-center justify-center p-6'>
                  <fruitTypeItem.icon className='w-12 h-12 mb-4 text-primary' />
                  <span>{fruitTypeItem.label}</span>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </section>
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Feature Products</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {
              productList && productList.length > 0
                ? productList.map((productItem) => (
                  <ShoppingProductTile product={productItem} />
                ))
                : null
            }
          </div>
          {limit < totalProduct && (
            <p
              className='text-center mt-2 w-full cursor-pointer hover:opacity-50'
              onClick={() => {
                setLimit((prevLimit) => prevLimit + 4);
              }}
            >
              Show more {Math.max(totalProduct - limit, 0)} result
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home;