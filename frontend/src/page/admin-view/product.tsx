import { addNewProduct, deleteProduct, editProduct, fetchAllProduct } from "@/store/admin/product-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdateProductForm from "@/components/admin-view/product-component/product-update";
import AddProductForm from "@/components/admin-view/product-component/product-add";
import ProductList from "@/components/admin-view/product-component/product-list";
import PaginationComponent from "@/components/admin-view/pagination";
import { Button } from "@/components/ui/button";
import { Product } from "@/config/entity";

const AdminProductPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { productList, isLoading, currentPage, totalPages } = useSelector((state: RootState) => state.adminProduct);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogAdd, setOpenDialogAdd] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    useEffect(() => {
        dispatch(fetchAllProduct({ page: currentPage, limit: 10 }))
    }, [dispatch, currentPage])

    const handleAddProduct = (formData: Omit<Product, 'id'>) => {
        dispatch(addNewProduct(formData)).then(() => {
            dispatch(fetchAllProduct({ page: currentPage, limit: 10 }))
            setOpenDialogAdd(false);
        })
    }
    console.log(editingProduct);
    const handleEditProduct = (id: number, formData: Omit<Product, 'id'>) => {
        dispatch(editProduct({ id, formData })).then(() => {
            dispatch(fetchAllProduct({ page: currentPage, limit: 10 }));
            setEditingProduct(null);
            setOpenDialog(false);
        })
    }

    const handleDeleteProduct = (id: number) => {
        dispatch(deleteProduct(id)).then(() => {
            dispatch(fetchAllProduct({ page: currentPage, limit: 10 }))
        })
    }

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllProduct({ page: pageNumber, limit: 10 }))
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Promotion</h1>
            {
                isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Dialog open={openDialogAdd} onOpenChange={setOpenDialogAdd}>
                        <DialogTrigger asChild>
                            <Button className="text-white py-2 px-2 rounded mb-4">Add New Promotion</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[600px] flex flex-col items-center justify-center">
                            <h2>Add New Promotion</h2>
                            <AddProductForm onAdd={handleAddProduct} />
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                editingProduct && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent className="max-w-[600px] flex flex-col items-center justify-center">
                            <h2>Edit Promotion</h2>
                            <UpdateProductForm product={editingProduct} onSave={handleEditProduct} />
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <ProductList
                            products={productList}
                            onEdit={(product) => {
                                setEditingProduct({
                                    id: product.id,
                                    name: product.name,
                                    fruitType_id: product.fruitType.id,
                                    description: product.description,
                                    price: product.price,
                                    quantity: product.quantity,
                                    unit: product.unit,
                                    image: product.image,
                                    isActive: product.isActive,
                                    category_id: product.categories.map((item) => item.id),
                                    promotion_id: product.promotions.map((item) => item.id)
                                })
                                setOpenDialog(true)
                            }}
                            onDelete={handleDeleteProduct}
                        />
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )
            }
        </div>
    )
}

export default AdminProductPage;