import { addNewRole, deleteRole, editRole, fetchAllRole } from "@/store/admin/role-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdateRoleForm from "@/components/admin-view/role-component/role-update";
import AddRoleForm from "@/components/admin-view/role-component/role-add";
import RoleList from "@/components/admin-view/role-component/role-list";
import PaginationComponent from "@/components/admin-view/pagination";
import { Button } from "@/components/ui/button";
import { Role } from "@/config/entity";

const AdminRolePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {roleList, isLoading, currentPage, totalPages} = useSelector((state: RootState) => state.adminRole);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    useEffect(() => {
        dispatch(fetchAllRole({page: currentPage, limit: 5}))
    }, [dispatch, currentPage]);
    const handleAddRole = (formData: Omit<Role, 'id'>) => {
        dispatch(addNewRole(formData)).then(() => {
            dispatch(fetchAllRole({page: currentPage, limit: 5}))
            setOpenDialog(false);
        })
    }
    const handleEditRole = (id: number, formData: Omit<Role, 'id'>) => {
        dispatch(editRole({id, formData})).then(() => {
            dispatch(fetchAllRole({page: currentPage, limit: 5}));
            setEditingRole(null);
            setOpenDialog(false);
        })
    } 

    const handleDeleteRole = (id: number) => {
        dispatch(deleteRole(id)).then(() => {
            dispatch(fetchAllRole({page: currentPage, limit: 5}));
        })
    }

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllRole({page: pageNumber, limit: 5}));
    }

    return(
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>Manage Role</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='text-white py-2 px-4 rounded mb-4'>Add New Role</Button>
                </DialogTrigger>
                <DialogContent>
                    <h2 className='text-xl font-bold mb-4'>Add New Role</h2>
                    <AddRoleForm onAdd={handleAddRole} />
                </DialogContent>
            </Dialog>
            {
                editingRole && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent>
                            <h2 className='text-xl font-bold mb-4'>Edit Category</h2>
                            <UpdateRoleForm role={editingRole} onSave={handleEditRole}/>
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                isLoading ? (
                    <p>Loading roles....</p>
                ) : (
                    <>
                        <RoleList roles={roleList} onEdit={(role) => {
                            setEditingRole(role)
                            setOpenDialog(true)
                        }} onDelete={handleDeleteRole} />
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )
            }
        </div>
    )
}

export default AdminRolePage;