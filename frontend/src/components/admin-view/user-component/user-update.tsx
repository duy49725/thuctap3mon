import React, {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserToManage } from "@/config/entity";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRole } from "@/store/admin/role-slice";
import MultiSelect from 'react-select';
import ImageUpload from "../image-upload";
import { AppDispatch, RootState } from "@/store/store";

interface UpdateUserFormProps{
    user: UserToManage;
    onSave: (id: string, data: UserToManage) => void;
}

const userInitial: UserToManage = {
    id: '',
    email: '',
    password: '',
    fullName: '',
    avatar: '',
    isVerified: false,
    isActive: false,
    roles_Id: []
}

const UpdateUserForm = ({user, onSave}: UpdateUserFormProps) => {
    const [userForm, setUserForm] = useState<UserToManage>(userInitial);
    const dispatch = useDispatch<AppDispatch>();
    const {roleList, totalRoles} = useSelector((state: RootState) => state.adminRole);
    const [rolesOption, setRolesOption] = useState<Array<{value: Number, label: string}>>([]);
    const [selectedRoles, setSelectedRole] = useState<Array<{value: Number, label: string}>>(
        roleList?.length > 0
            ? roleList.filter(item => user.roles_Id.includes(item.id)).map(item => ({value: item.id, label: item.roleName}))
            : []
    )
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
    useEffect(() => {
        dispatch(fetchAllRole({page: 1, limit: totalRoles}))
        if(roleList.length > 0){
            const options = roleList.map((item) => ({
                value: item.id,
                label: item.roleName
            }));
            setRolesOption(options);
        }
    }, [dispatch, roleList]);
    useEffect(() => {
        setUserForm(user);
    }, [user])
    console.log(userForm);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(user.id, {...userForm, avatar: uploadedImageUrl});
    }
    return(
        <form onSubmit={handleSubmit}>
            <Label>User Email</Label>
            <Input 
                type="text"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                placeholder="Enter Email"
                className="mb-4"
            />
            <Label>User Password</Label>
            <Input 
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                placeholder="Enter Password"
                className="mb-4"
            />
            <Label>Full Name</Label>
            <Input 
                type="text"
                value={userForm.fullName}
                onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                placeholder="Enter Full Name"
                className="mb-4"
            />
            <Label>Choose User Avatar</Label>
            <ImageUpload 
                imageFile={imageFile}
                setImageFile={setImageFile}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
            />
            <div className="flex items-center space-x-2 mb-4 mt-4">
                <Checkbox 
                    id="term2"
                    checked={Boolean(userForm.isVerified)}
                    onCheckedChange={(checked) => setUserForm({...userForm, isVerified: Boolean(checked)})}
                />
                <label htmlFor="term2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Is Verified
                </label>
            </div>
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                    id="term3"
                    checked={Boolean(userForm.isActive)}
                    onCheckedChange={(checked2) => {setUserForm({...userForm, isActive: Boolean(checked2)})}}
                />
                <label htmlFor="term3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Is Active
                </label>
            </div>
            <Label>Select Role</Label>
            <MultiSelect
                isMulti
                value={selectedRoles}
                options={rolesOption}
                onChange={(selectedOption) => {
                    setSelectedRole([...selectedOption])
                    setUserForm({...user, roles_Id: selectedOption.map(role => Number(role.value))})
                }}
                styles={{
                    container: (provided) => ({ ...provided, width: '100%', marginBottom: '1rem' }),
                }}
            />
            <Button className="w-full">Update User</Button>
        </form>
    )
}

export default UpdateUserForm;
