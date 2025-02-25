import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddRoleFormProps{
    onAdd: (role: {roleName: string}) => void;
}

const AddRoleForm = ({onAdd}: AddRoleFormProps) => {
    const [roleName, setRoleName] = useState<string>('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({roleName: roleName});
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
            <Button type="submit" className="w-full">Add Role</Button>
        </form>
    )
}

export default AddRoleForm;