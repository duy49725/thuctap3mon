import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Input } from "@/components/ui/input";   // Shadcn Input
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn Card

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/resetPassword", {
        token,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu</CardTitle>
          <CardDescription className="text-center">
            Nhập mật khẩu mới để hoàn tất quá trình đặt lại.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Xác nhận
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {message && (
            <p
              className={`text-sm ${
                message.includes("thành công") ? "text-green-600" : "text-red-600"
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

export default ResetPassword;