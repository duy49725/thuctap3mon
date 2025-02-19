import RegisterForm from "@/components/auth/register-form";
import { AppleIcon, GalleryVerticalEnd } from "lucide-react";


const RegisterPage = () =>{
    return(
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="" className="flex items-center gap-2 font-medium">
                        <div className="">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Be Chuoi.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <AppleIcon size={50}/>
            </div>
        </div>
    )
}

export default RegisterPage;