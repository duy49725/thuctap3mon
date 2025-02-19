import { addNewFruitType, deleteFruitType, editFruitType, fetchAllFruitType } from "@/store/admin/fruitType-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditFruitTypeForm from "@/components/admin-view/fruitType-component/fruitType-update";
import AddFruitTypeForm from "@/components/admin-view/fruitType-component/fruitType-add";
import FruitTypeList from "@/components/admin-view/fruitType-component/fruitType-list";
import PaginationComponent from "@/components/admin-view/pagination";
import { Button } from "@/components/ui/button";

interface FruitType{
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date
}

const AdminFruitTypePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {fruitTypeList, isLoading, currentPage, totalPages, totalFruitTypes} = useSelector((state: RootState) => state.adminFruitType);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    console.log(totalFruitTypes)
    const [editingFruitType, setEditingFruitType] = useState<FruitType | null>(null);
    useEffect(() => {
        dispatch(fetchAllFruitType({page: currentPage, limit: 10}))
    }, [dispatch, currentPage]);

    const handleAddFruitType = (formData: Omit<FruitType, 'id' | 'createdAt' | 'updatedAt'>) => {
        dispatch(addNewFruitType(formData)).then(() => {
            dispatch(fetchAllFruitType({page: currentPage, limit: 10}));
            setOpenDialog(false);
        })
    }

    const handleEditFruitType = (id: number, formData: Omit<FruitType, 'id' | 'createdAt' | 'updatedAt'>) => {
        dispatch(editFruitType({id, formData})).then(() => {
            dispatch(fetchAllFruitType({page: currentPage, limit: 10}));
            setEditingFruitType(null);
            setOpenDialog(false);
        })
    }

    const handleDeleteFruitType = (id: number) => {
        dispatch(deleteFruitType(id)).then(() => {
            dispatch(fetchAllFruitType({page: currentPage, limit: 10}))
        })
    }   

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllFruitType({page: pageNumber, limit: 5}));
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Fruit Type</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-white py-2 px-4 rounded mb-4">Add New Fruit Type</Button>
                </DialogTrigger>
                <DialogContent>
                    <h2 className="text-xl font-bold mb-4">Add New Fruit Type</h2>
                    <AddFruitTypeForm onAdd={handleAddFruitType} />
                </DialogContent>
            </Dialog>
            {
                editingFruitType && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent>
                            <h2>Edit Fruit Type</h2>
                            <EditFruitTypeForm fruitType={editingFruitType} onSave={handleEditFruitType} />
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                isLoading ? (
                    <p>Loading Fruit Type....</p>
                ) : (
                    <>
                        <FruitTypeList 
                            fruitTypes={fruitTypeList} 
                            onEdit={(fruitType) => {
                                setEditingFruitType(fruitType)
                                setOpenDialog(true)
                            }}
                            onDelete={handleDeleteFruitType}
                        />
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )
            }
        </div>
    )
}

export default AdminFruitTypePage;