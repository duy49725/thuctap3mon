import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { shoppingViewHeaderMenuItems } from "@/config";
import { Apple, LogOut, Menu, ShoppingCart, UserCog2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllCart } from "@/store/shopping/cart-slice";
import UserCartWrapper from "./cart-wrapper";


const MenuItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:flex-row lg:items-center gap-6">
            {
                shoppingViewHeaderMenuItems.map((menuItem) => (
                    <Label
                        onClick={() => navigate(menuItem.path)}
                        className="text-sm font-medium cursor-pointer" key={menuItem.id}>
                        {menuItem.label}
                    </Label>
                ))
            }
        </nav>
    )
}

const ShoppingHeader = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-16">
                <Link className="flex items-center gap-2" to={'/'}>
                    <Apple className="h-6 w-6" />
                    <span>Fresh Fruit</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className='w-6 h-6' />
                            <span className='sr-only'>Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side='left' className='w-full max-w-sm'>
                        <MenuItem />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>
                <div className='hidden lg:block'>
                    <MenuItem />
                </div>
                <div>
                    <div className="hidden lg:block">
                        <HeaderRightContent />
                    </div>
                </div>
            </div>
        </header>
    )
}

const HeaderRightContent = () => {
    const [openCartSheet, setOpenCartSheet] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state.adminAuth);
    const { cartList, isLoading } = useSelector((state: RootState) => state.userCart);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
       if(user?.userId){
            dispatch(fetchAllCart(user?.userId))
       }
    }, [dispatch, user.userId])
    const navigate = useNavigate();
    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet
                open={openCartSheet}
                onOpenChange={() => setOpenCartSheet(false)}
            >
                <Button
                    onClick={() => setOpenCartSheet(true)}
                    className="w-32 h-8 flex justify-center items-center relative"
                >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    <span>0</span>
                </Button>
                <SheetContent className="sheet-custom w-[600px]" side={"right"}>
                    <SheetHeader>
                        <SheetTitle className="mx-auto">Shopping Cart</SheetTitle>
                        <SheetDescription className="mx-auto">
                            Make changes to your cart here
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-8 py-4">
                        <UserCartWrapper totalCartAmount={cartList.totalPrice} discount={cartList.discount} setOpenCartSheet={setOpenCartSheet} cartItems={cartList.cartDetails && cartList.cartDetails.length > 0 ? cartList.cartDetails : []}/>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarFallback className="bg-black text-white font-extralight">
                            Be Chuoi
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel>Logged in as Be Chuoi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem  onClick={() => {
                            navigate('/shopping/account')
                        }}>
                        <UserCog2 className="mr-2 h-4 w-4"/>
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ShoppingHeader;