import { addNewDiscount, deleteDiscount, editDiscount, fetchAllDiscount } from "@/store/admin/discount-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdateDiscountCodeForm from "@/components/admin-view/discount-component/discount-update";
import AddDiscountCodeForm from "@/components/admin-view/discount-component/discount-add";
import DiscountCodeList from "@/components/admin-view/discount-component/discount-list";
import PaginationComponent from "@/components/admin-view/pagination";
import { Button } from "@/components/ui/button";
import { DiscountCode } from "@/config/entity";

const AdminDiscountCodePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {discountCodeList, isLoading, currentPage, totalPages} = useSelector((state: RootState) => state.adminDiscount);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingDiscount, setEdtingDiscount] = useState<DiscountCode | null>(null);
    useEffect(() => {
        dispatch(fetchAllDiscount({page: currentPage, limit: 10}))
    }, [dispatch, currentPage])
    const handleAddDiscount = (formData: Omit<DiscountCode, 'id'>) => {
        dispatch(addNewDiscount(formData)).then(() => {
            dispatch(fetchAllDiscount({page: currentPage, limit: 10}))
            setOpenDialog(false);
        })
    }

    const handleEditDiscount = (id: number, formData: Omit<DiscountCode, 'id'>) => {
        dispatch(editDiscount({id, formData})).then(() => {
            dispatch(fetchAllDiscount({page: currentPage, limit: 10}))
            setEdtingDiscount(null);
        })
    }

    const handleDeleteDiscount = (id: number) => {
        dispatch(deleteDiscount(id)).then(() => {
            dispatch(fetchAllDiscount({page: currentPage, limit: 10}))
        })
    }

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllDiscount({page: pageNumber, limit: 10}))
    }
    console.log(editingDiscount);
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Discount Code</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-white py-2 px-2 rounded mb-4">Add New Discount Code</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[600px] flex flex-col items-center justify-center">
                    <h2>Add New Discount Code</h2>
                    <AddDiscountCodeForm onAdd={handleAddDiscount} />
                </DialogContent>
            </Dialog>
            {
                editingDiscount && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent className="max-w-[600px] flex flex-col items-center justify-center">
                            <h2>Edit </h2>
                            <UpdateDiscountCodeForm discount={editingDiscount} onSave={handleEditDiscount} />
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                isLoading ? (
                    <p>Loading Discount....</p>
                ) : (
                    <>
                        <DiscountCodeList 
                            discounts={discountCodeList}
                            onEdit={(discount) => {
                                setEdtingDiscount(discount)
                                setOpenDialog(true)
                            }}
                            onDelete={handleDeleteDiscount}
                        />
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )
            }
        </div>
    )
}

export default AdminDiscountCodePage;