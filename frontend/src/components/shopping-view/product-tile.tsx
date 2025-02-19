import { ProductResponse } from "@/config/entity";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";


const ShoppingProductTile = ({ product }: { product: ProductResponse }) => {
    const getBestDiscountedPrice = (product: ProductResponse) => {
        if (!product.promotions || product.promotions.length === 0) {
            return {
                bestPrice: parseFloat(String(product.price)),
                bestDiscountType: null,
                discountAmount: 0 // Đặt mặc định là 0 để tránh lỗi undefined
            };
        }

        return product.promotions.reduce(
            (best: { bestPrice: number; bestDiscountType: string | null; discountAmount: number }, promo) => {
                let discountedPrice: number;

                if (promo.discountType === "percentage") {
                    discountedPrice = product.price * (1 - parseFloat(String(promo.discountAmount)) / 100);
                } else if (promo.discountType === "fixed") {
                    discountedPrice = product.price - parseFloat(String(promo.discountAmount));
                } else {
                    return best; // Bỏ qua nếu không phải kiểu giảm giá hợp lệ
                }

                return discountedPrice < best.bestPrice
                    ? { bestPrice: discountedPrice, bestDiscountType: promo.discountType, discountAmount: parseFloat(String(promo.discountAmount)) }
                    : best;
            },
            {
                bestPrice: parseFloat(String(product.price)),
                bestDiscountType: null,
                discountAmount: 0 // Đảm bảo discountAmount tồn tại trong mọi trường hợp
            }
        );
    };
    const { bestPrice, bestDiscountType, discountAmount } = getBestDiscountedPrice(product);
    return (
        <div>
            <Card className="w-full max-w-sm mx-auto flex flex-col justify-between">
                <div className="flex flex-col">
                    <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-[300px] object-cover rounded-t-lg" />
                        {
                            product.quantity === 0
                                ? <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                    Out Of Stock
                                </Badge>
                                : product.quantity < 10
                                    ? <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                        {`Only ${product.quantity} item left`}
                                    </Badge>
                                    : product.promotions && product.promotions.length > 0
                                        ? bestDiscountType === 'fixed'
                                            ? <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                                Sale {discountAmount} VND
                                            </Badge>
                                            : <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                                Sale {discountAmount} %
                                            </Badge>
                                        : null
                        }
                    </div>
                    <CardContent className="p-4">
                        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                        <div className="flex justify-between items-center mb-2">
                            <p>Old Price: <span className={`${product.promotions && product.promotions.length > 0 ? 'line-through' : null } text-sm text-muted-foreground`}>{product.price}</span></p>
                            {
                                product.promotions && product.promotions.length > 0 && <p>New Price: <span className="text-sm text-muted-foreground">{bestPrice}</span></p>
                            }
                        <div>{product.finalPrice}</div>
                        </div>

                    </CardContent>
                </div>
                <CardFooter>
                    <Button className="w-full mr-2">
                        View Details
                    </Button>
                    {
                        product.quantity === 0
                            ? <Button className="w-full opacity-65 cursor-not-allowed">
                                Out Of Stock
                            </Button>
                            : <Button className="w-full bg-red-400">
                                Add to cart
                            </Button>
                    }
                </CardFooter>
            </Card>
        </div>
    )
}

export default ShoppingProductTile;