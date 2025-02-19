import { addNewPromotion, deletePromotion, editPromotion, fetchAllPromotion } from "@/store/admin/promotion-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdatePromotionForm from "@/components/admin-view/promotion-component/promotion-update";
import AddPromotionForm from "@/components/admin-view/promotion-component/promotion-add";
import PromotionList from "@/components/admin-view/promotion-component/promotion-list";
import PaginationComponent from "@/components/admin-view/pagination";
import { Button } from "@/components/ui/button";
import { EditPromotionForm as Promotion } from "@/components/admin-view/promotion-component/promotion-update";

const AdminPromotionPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {promotionList, isLoading, currentPage, totalPages} = useSelector((state: RootState) => state.adminPromotion);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    useEffect(() => {
        dispatch(fetchAllPromotion({page: currentPage, limit: 10}))
    }, [dispatch, currentPage])

    const handleAddPromotion = (formData: Omit<Promotion, 'id'>) => {
        dispatch(addNewPromotion(formData)).then(() => {
            dispatch(fetchAllPromotion({page: currentPage, limit: 10}))
            setOpenDialog(false);
        })
    }

    const handleEditPromotion = (id: number, formData: Omit<Promotion, 'id'>) => {
        dispatch(editPromotion({id, formData})).then(() => {
            dispatch(fetchAllPromotion({page: currentPage, limit: 10}));
            setEditingPromotion(null);
            setOpenDialog(false);
        })
    }

    const handleDeletePromotion = (id: number) => {
        dispatch(deletePromotion(id)).then(() => {
            dispatch(fetchAllPromotion({page: currentPage, limit: 10}))
        })
    }

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllPromotion({page: pageNumber, limit: 10}))
    }
    console.log(editingPromotion)
  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Promotion</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-white py-2 px-2 rounded mb-4">Add New Promotion</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] flex flex-col items-center justify-center">
                <h2>Add New Promotion</h2>
                <AddPromotionForm onAdd={handleAddPromotion} />
            </DialogContent>
        </Dialog>
        {
            editingPromotion && (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="max-w-[600px] flex flex-col items-center justify-center">
                        <h2>Edit Promotion</h2>
                        <UpdatePromotionForm promotion={editingPromotion} onSave={handleEditPromotion} />
                    </DialogContent>
                </Dialog>
            )
        }
        {
            isLoading ? (
                <p>Loading Promotion...</p>
            ) : (
                <>
                    <PromotionList 
                        promotions={promotionList} 
                        onEdit={(promotion) => {
                            setEditingPromotion(promotion)
                            setOpenDialog(true)
                        }}
                        onDelete={handleDeletePromotion}
                    />
                    <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )
        }
    </div>
  )
}

export default AdminPromotionPage;