import { useEffect, useState } from 'react';
import { fetchAllFeatureImage } from '@/store/common/feature-slice';
import { fetchAllShoppingProducts, fetchPromotionsWithProducts, fetchShoppingProductDetail } from '@/store/shopping/product-slice';
import { useDispatch, useSelector } from 'react-redux';
import { Apple, Banana, Cherry, ChevronLeftIcon, ChevronsLeftIcon, ChevronsRightIcon, Citrus, Grape, Vegan } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { addToCart, fetchAllCart } from '@/store/shopping/cart-slice';
import { useToast } from '@/hooks/use-toast';
import ProductDetailsDialog from '@/components/shopping-view/product-detail';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fruitTypeWithIcon = [
  { id: "citrus", label: "Citrus", icon: Citrus },
  { id: "apple", label: "Apple", icon: Apple },
  { id: "banana", label: "Banana", icon: Banana },
  { id: "cherry", label: "Cherry", icon: Cherry },
  { id: "grape", label: "Grape", icon: Grape },
  { id: "vegan", label: "Vegan", icon: Vegan },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(8);
  const dispatch = useDispatch<AppDispatch>();
  const { productList, totalProduct, productDetail, promotions } = useSelector((state: RootState) => state.shopProduct);
  const { featureImageList } = useSelector((state: RootState) => state.commonFeature);
  const { cartList } = useSelector((state: RootState) => state.userCart);
  const { user } = useSelector((state: RootState) => state.adminAuth);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllShoppingProducts({ page: 1, limit }));
  }, [limit, dispatch]);

  useEffect(() => {
    dispatch(fetchAllFeatureImage());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPromotionsWithProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    setOpenDetailsDialog(!!productDetail);
  }, [productDetail]);

  const handleGetProductDetails = (productId: number) => {
    dispatch(fetchShoppingProductDetail(productId));
  };

  const handleAddToCart = (productId: number, totalStock: number, unitPrice: number) => {
    const cartItems = cartList.cartDetails || [];
    const existingItemIndex = cartItems.findIndex((item) => item.product.id === productId);
    if (existingItemIndex > -1) {
      const currentQuantity = cartItems[existingItemIndex].quantity;
      if (currentQuantity + 1 > totalStock) {
        toast({
          title: `Only ${currentQuantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }
    dispatch(addToCart({ userId: user?.userId, product_id: productId, quantity: 1, unitPrice }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllCart(user?.userId));
          toast({ title: "Product added to cart!" });
        }
      });
  };

  const calculateDiscountedPrice = (price: number, discountAmount: number, discountType: string) => {
    if (discountType === "percentage") {
      return (price * (1 - discountAmount / 100)).toFixed(2);
    } else if (discountType === "fixed") {
      return (price - discountAmount).toFixed(2);
    }
    return price.toFixed(2);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: (
      <div>
        <div className="absolute top-1/2 -translate-y-1/2" style={{ zIndex: 1000, left: '-10px' }}>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow-md border-gray-300"
          >
            <ChevronsLeftIcon className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>
    ),
    nextArrow: (
      <div>
        <div className="absolute top-1/2 -translate-y-1/2" style={{ zIndex: 1000, right: '-10px' }}>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow-md border-gray-300"
          >
            <ChevronsRightIcon className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>
    ),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden shadow-xl">
        {featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={`Slide ${index}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            />
          ))
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No banner images</div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow-md z-20"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length)}
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow-md z-20"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % featureImageList.length)}
        >
          <ChevronsRightIcon className="w-6 h-6 text-gray-700" />
        </Button>
      </div>

      {/* Fruit Type Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Shop by Fruit Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {fruitTypeWithIcon.map((fruit) => (
              <Card key={fruit.id} className="hover:shadow-lg transition-shadow duration-300 border-none">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <fruit.icon className="w-12 h-12 mb-4 text-green-600" />
                  <span className="text-lg font-medium text-gray-700">{fruit.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.length > 0 ? (
              productList.map((product) => (
                <ShoppingProductTile
                  key={product.id}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                  className=''
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No products available</p>
            )}
          </div>
          {limit < totalProduct && (
            <Button
              variant="link"
              className="mt-6 mx-auto block text-blue-600 hover:text-blue-800"
              onClick={() => setLimit((prev) => prev + 4)}
            >
              Show more ({Math.max(totalProduct - limit, 0)} remaining)
            </Button>
          )}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-12 bg-white max-w-full">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Featured Promotions</h1>
          {promotions.length > 0 ? (
            promotions.map((promotion) => (
              <div key={promotion.id} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                  {promotion.name}{" "}
                  <span className="text-red-500">
                    ({promotion.discountType === "percentage" ? `${promotion.discountAmount}% Off` : `-${promotion.discountAmount} Fixed`})
                  </span>
                </h2>
                {promotion.products.length > 0 ? (
                  <div className="relative mx-12">
                    <Slider {...sliderSettings}>
                      {promotion.products.map((product) => (
                        <div key={product.id} className="px-2">
                          <ShoppingProductTile
                            product={product}
                            handleGetProductDetails={handleGetProductDetails}
                            handleAddToCart={handleAddToCart}
                            className="max-w-[350px]"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <p className="text-gray-500">No products available for this promotion.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No promotions available</p>
          )}
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetail} />
    </div>
  );
};

export default Home;