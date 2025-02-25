import React, {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from "@/config/entity";

interface updateRoleFormProps{
    role: Role;
    onSave: (id: number, role: {roleName: string}) => void;
}

const UpdateRoleForm = ({role, onSave}: updateRoleFormProps) => {
    const [roleName, setRoleName] = useState<string>(role.roleName);
    useEffect(() => {
        setRoleName(role.roleName);
    }, [role])
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(role.id, {roleName: roleName});
        setRoleName('');
    }
    return(
        <form className="w-full" onSubmit={handleSubmit}>
            <Label className="mb-4">
                Role Name
            </Label>
            <Input 
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Role Name"
                className="mb-4"
            />
            <Button type="submit" className="w-full">Update Role</Button>
        </form>
    )
}

export default UpdateRoleForm;