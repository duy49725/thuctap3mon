import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, ArrowRightIcon } from 'lucide-react'; // Sử dụng icon từ Lucide
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để điều hướng

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/shopping/home'); // Điều hướng người dùng tới trang mua sắm
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
      <Card className="w-full max-w-lg text-center shadow-2xl transform transition-all duration-500 hover:scale-105 bg-gray-900 border border-gray-700">
        <CardHeader>
          <div className="flex justify-center">
            <CheckCircleIcon className="text-white w-24 h-24" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">Payment Success!</h1>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-lg">
            Your payment was successfully processed. Thank you for your purchase!
          </p>
          <p className="text-gray-400 mt-2">You will receive a confirmation email shortly.</p>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <Button 
            onClick={handleContinueShopping} 
            className="bg-gray-700 text-white hover:bg-gray-600 hover:text-gray-200 border border-gray-500"
          >
            Continue Shopping
            <ArrowRightIcon className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
