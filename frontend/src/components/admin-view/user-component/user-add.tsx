import React, {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserToManage } from "@/config/entity";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRole } from "@/store/admin/role-slice";
import MultiSelect from 'react-select';
import ImageUpload from "../image-upload";
import { AppDispatch, RootState } from "@/store/store";

interface AddUserFormProps{
    onAdd: (user: Omit<UserToManage, 'id'>) => void;
}

const userInitial: Omit<UserToManage, 'id'> = {
    email: '',
    password: '',
    fullName: '',
    avatar: '',
    isVerified: false,
    isActive: false,
    roles_Id: []
}

const AddUserForm = ({onAdd}: AddUserFormProps) => {
    const [user, setUser] = useState<Omit<UserToManage, 'id'>>(userInitial);
    const dispatch = useDispatch<AppDispatch>();
    const {roleList, totalRoles} = useSelector((state: RootState) => state.adminRole);
    const [rolesOption, setRolesOption] = useState<Array<{value: Number, label: string}>>([]);
    const [selectedRoles, setSelectedRole] = useState<Array<{value: Number, label: string}>>([]);
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({...user, avatar: uploadedImageUrl});
        setUser(userInitial);
    }
    return(
        <form onSubmit={handleSubmit}>
            <Label>User Email</Label>
            <Input 
                type="text"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="Enter Email"
                className="mb-4"
            />
            <Label>User Password</Label>
            <Input 
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="Enter Password"
                className="mb-4"
            />
            <Label>Full Name</Label>
            <Input 
                type="text"
                value={user.fullName}
                onChange={(e) => setUser({...user, fullName: e.target.value})}
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
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                    id="term2"
                    onCheckedChange={(checked) => setUser({...user, isVerified: Boolean(checked)})}
                />
                <label htmlFor="term2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Is Verified
                </label>
            </div>
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                    id="term2"
                    onCheckedChange={(checked) => setUser({...user, isActive: Boolean(checked)})}
                />
                <label htmlFor="term2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                    setUser({...user, roles_Id: selectedOption.map(role => Number(role.value))})
                }}
                styles={{
                    container: (provided) => ({ ...provided, width: '100%', marginBottom: '1rem' }),
                }}
            />
            <Button className="w-full">Add User</Button>
        </form>
    )
}

export default AddUserForm;
