import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";

interface AdminHeaderProps{
    setOpen: (open: boolean) => void;
}
const AdminHeader = ({setOpen}: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background border-collapse">
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
            <AlignJustify />
            <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 justify-end">
            <Button
                className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
            >
                <LogOut />
                Logout
            </Button>
        </div>
    </div>
  )
}

export default AdminHeader