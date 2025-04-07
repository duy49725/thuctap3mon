import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";  
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Mail } from "lucide-react"; 

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); 
    try {
      const response = await axios.post("http://localhost:3000/api/auth/forgotPassword", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 rounded-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Quên mật khẩu</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập email để nhận liên kết đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full pl-10 border-gray-300 focus:border-slate-500 focus:ring-slate-500 transition-all"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2 rounded-md hover:scale-105 transition-transform duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                "Gửi"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {message && (
            <p
              className={`text(sm font-medium ${
                message.includes("gửi") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;