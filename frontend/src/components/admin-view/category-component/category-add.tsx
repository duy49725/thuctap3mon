import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddCategoryFormProps{
    onAdd: (category: {name: string, description: string}) => void
}

const AddCategoryForm = ({onAdd}: AddCategoryFormProps) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryDescription, setCategoryDescription] = useState<string>('');
    const handleSubnmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({name: categoryName, description: categoryDescription});
        setCategoryName('');
        setCategoryDescription('');
    }
    return(
        <form onSubmit={handleSubnmit}>
            <Input 
                type="text" 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)} 
                placeholder="Category Name" 
                className="mb-4"
            />
            <Input 
                type="text"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Category Description"
                className="mb-4"
            />
            <Button type="submit" className="w-full">Add Category</Button>
        </form> 
    )
}

export default AddCategoryForm;