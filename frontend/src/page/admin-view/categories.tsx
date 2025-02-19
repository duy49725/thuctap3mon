import {addNewCategory, deleteCategory, editCategory, fetchAllCategory} from '@/store/admin/category-slice';
import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import EditCategoryForm from '@/components/admin-view/category-component/category-update';
import AddCategoryForm from '@/components/admin-view/category-component/category-add';
import CategoryList from '@/components/admin-view/category-component/category-list';
import PaginationComponent from '@/components/admin-view/pagination';
import { Button } from '@/components/ui/button';
interface Category{
    id: number;
    name: string;
    description: string;
}

const AdminCategoryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {categoryList, isLoading, currentPage, totalPages} = useSelector((state: RootState) => state.adminCategory);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    useEffect(() => {
        dispatch(fetchAllCategory({page: currentPage, limit: 5}))
    }, [dispatch, currentPage]);
    const handleAddCategory = (formData: Omit<Category, 'id'>) => {
        dispatch(addNewCategory(formData)).then(() => {
            dispatch(fetchAllCategory({page: currentPage, limit: 5}))
            setOpenDialog(false);
        })
    }
    const handleEditCategory = (id: number, formData: Omit<Category, 'id'>) => {
        dispatch(editCategory({id, formData})).then(() => {
            dispatch(fetchAllCategory({page: currentPage, limit: 5}));
            setEditingCategory(null);
            setOpenDialog(false);
        })
    } 

    const handleDeleteCategory = (id: number) => {
        dispatch(deleteCategory(id)).then(() => {
            dispatch(fetchAllCategory({page: currentPage, limit: 5}));
        })
    }

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllCategory({page: pageNumber, limit: 5}));
    }

    return(
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>Manage Categories</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='text-white py-2 px-4 rounded mb-4'>Add New Category</Button>
                </DialogTrigger>
                <DialogContent>
                    <h2 className='text-xl font-bold mb-4'>Add New Category</h2>
                    <AddCategoryForm onAdd={handleAddCategory} />
                </DialogContent>
            </Dialog>
            {
                editingCategory && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent>
                            <h2 className='text-xl font-bold mb-4'>Edit Category</h2>
                            <EditCategoryForm category={editingCategory} onSave={handleEditCategory}/>
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                isLoading ? (
                    <p>Loading categories....</p>
                ) : (
                    <>
                        <CategoryList categories={categoryList} onEdit={(category) => {
                            setEditingCategory(category)
                            setOpenDialog(true)
                        }} onDelete={handleDeleteCategory} />
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )
            }
        </div>
    )
}

export default AdminCategoryPage;
