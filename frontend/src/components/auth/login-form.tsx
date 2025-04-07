import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loginUser } from "@/store/auth/auth-slice";
import { useNavigate } from "react-router-dom";
import OAuth from "./OAuth";
import ForgotPassword from "./forgot-password";

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: email, password: password })).then((data) => {
      if (data.payload.success) {
        navigate('/shopping/home');
      }
    })
  }
  return (
    <div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your emai below to login your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="bechuoi@gmai.com" required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" type="submit">Login</Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <OAuth />
        </div>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/auth/register" className="underline underline-offset-4">
            Register
          </a>
        </div>
        <Button
          onClick={() => {
            navigate('/auth/forgotPassword')
          }}
        >
          Forgot Password
        </Button>
      </form>
     
    </div>
  )
}

export default LoginForm;