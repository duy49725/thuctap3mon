import { addNewUser, deleteUser, editUser, fetchAllUser } from "@/store/admin/user-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdateUserForm from "@/components/admin-view/user-component/user-update";
import AddUserForm from "@/components/admin-view/user-component/user-add";
import UserList from "@/components/admin-view/user-component/user-list";
import PaginationComponent from "@/components/admin-view/pagination";
import { Button } from "@/components/ui/button";
import { UserToManage } from "@/config/entity";
import { AppDispatch, RootState } from "@/store/store";

const AdminUserPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {userList, isLoading, currentPage, totalPages} = useSelector((state: RootState) => state.adminUser);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogAdd, setOpenDialogAdd] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserToManage | null>(null);
    useEffect(() => {
        dispatch(fetchAllUser({page: currentPage, limit: 10}))
    }, [dispatch, currentPage])

    const handleAddUser = (formData: Omit<UserToManage, 'id'>) => {
        dispatch(addNewUser(formData)).then(() => {
            dispatch(fetchAllUser({page: currentPage, limit: 10}))
            setOpenDialogAdd(false);
        })
    }

    const handleEditUser = (id: string, formData: Omit<UserToManage, 'id'>) => {
        dispatch(editUser({id, formData})).then(() => {
            dispatch(fetchAllUser({page: currentPage, limit: 10}));
            setEditingUser(null);
            setOpenDialog(false);
        })
    }

    const handleDeleteUser = (id: string) => {
        dispatch(deleteUser(id)).then(() => {
            dispatch(fetchAllUser({page: currentPage, limit: 10}))
        })
    }

    const handlePageChange = (pageNumber: number) => {
        dispatch(fetchAllUser({page: pageNumber, limit: 10}))
    }
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage User</h1>
            {
                isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="text-white py-2 px-2 rounded mb-4">Add New User</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <h2>Add New User</h2>
                            <AddUserForm onAdd={handleAddUser} />
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                editingUser && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent>
                            <h2>Edit User</h2>
                            <UpdateUserForm user={editingUser} onSave={handleEditUser} />
                        </DialogContent>
                    </Dialog>
                )
            }
            {
                isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <UserList 
                            users={userList}
                            onEdit={(user) => {
                                setEditingUser({
                                    id: user.id,
                                    email: user.email,
                                    fullName: user.fullName,
                                    avatar: user.avatar,
                                    isVerified: user.isVerified,
                                    isActive: user.isActive,
                                    password: user.password,
                                    roles_Id: user.roles.map((item) => item.id)
                                })
                                setOpenDialog(true)
                            }}
                            onDelete={handleDeleteUser}
                        />
                        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                )
            }
        </div>
    )
}

export default AdminUserPage;