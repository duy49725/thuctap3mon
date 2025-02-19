import {Fragment, JSX} from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, Newspaper, PictureInPicture, ShoppingBasket, SpadeIcon, SquareParkingOffIcon, User } from 'lucide-react';

interface MenuItem{
    id: string;
    label: string;
    path: string;
    icon: JSX.Element;
}
export const adminSidebarMenuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard />,
    },
    {
        id: 'products',
        label: 'Products',
        path: '/admin/products',
        icon: <ShoppingBasket />,
    },
    {
        id: 'orders',
        label: 'Orders',
        path: '/admin/orders',
        icon: <BadgeCheck />,
    },
    {
        id: 'promotions',
        label: 'Promotions',
        path: '/admin/promotions',
        icon: <SquareParkingOffIcon />,
    },
    {
        id: 'category',
        label: 'Category',
        path: '/admin/categories',
        icon: <SpadeIcon />,
    },
    {
        id: 'user',
        label: 'User',
        path: '/admin/user',
        icon: <User />,
    },
    {
        id: 'feature',
        label: 'Feature',
        path: '/admin/feature',
        icon: <PictureInPicture />,
    },
    {
        id: 'fruitType',
        label: 'Fruit Type',
        path: '/admin/fruitType',
        icon: <Newspaper />
    }
]

interface MenuItemsProps{
    setOpen?: (open: boolean) => void;
}

function MenuItems({setOpen} : MenuItemsProps){
    const navigate = useNavigate();
    return <nav className='mt-8 flex-col flex gap-2'>
        {
            adminSidebarMenuItems.map(menuItem => 
                <div 
                    key={menuItem.id}
                    className='flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground'
                    onClick={() => {
                        navigate(menuItem.path)
                        setOpen ? setOpen(false) : null
                    }}
                >
                    {menuItem.icon}
                    <span>{menuItem.label}</span>
                </div>
            )
        }
    </nav>
}

interface AdminSidebarProps{
    open: boolean,
    setOpen: (open: boolean) => void;
}

const AdminSidebar = ({open, setOpen}: AdminSidebarProps) => {
    const navigate = useNavigate();
  return (
    <Fragment>
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className='w-64'>
                <div className='flex flex-col h-full'>
                    <SheetHeader>
                        <SheetTitle className='flex gap-2 mt-5 mb-5'>
                            <ChartNoAxesCombined size={30} />
                        </SheetTitle>
                    </SheetHeader>
                    <MenuItems setOpen={setOpen} />
                </div>
            </SheetContent>
        </Sheet>
        <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
            <div
                className='flex cursor-pointer items-center gap-2'
                onClick={() => {
                    navigate('/admin/dashboard')
                }}
            >
                <ChartNoAxesCombined size={30} />
                <h1 className='text-xl font-extrabold'>Admin Pannel</h1>
            </div>
            <MenuItems/>
        </aside>
    </Fragment>
  )
}

export default AdminSidebar;