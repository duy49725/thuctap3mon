import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Apple, LogOut, Menu, ShoppingCart, UserCog2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"


const MenuItem = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return(
        <nav className="flex flex-col mb-3 lg:mb-0 lg:flex-row lg:items-center gap-6">
             {
                    shoppingViewHeaderMenuItems.map((menuItem) => (
                        <Label className="text-sm font-medium cursor-pointer" key={menuItem.id}>
                            {menuItem.label}
                        </Label>
                    ))
                }
        </nav>
    )
}

const ShoppingHeader = () => {
    return(
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-16">
                <Link className="flex items-center gap-2" to={'/'}>
                    <Apple className="h-6 w-6"/>
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
    const [openCartSheet, setOpenCartSheet] = useState(false);
    return(
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
                    <DropdownMenuItem>
                        <UserCog2 className="mr-2 h-4 w-4" />
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