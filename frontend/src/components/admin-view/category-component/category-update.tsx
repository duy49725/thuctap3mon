import React, {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditCategoryFormProps{
    category: {id:number; name: string; description: string};
    onSave: (id: number, data: {name: string; description: string}) => void;
}

const EditCategoryForm = ({category, onSave}: EditCategoryFormProps) => {
    const [categoryId, setCategoryId] = useState<number>(category.id);
    const [categoryName, setCategoryName] = useState<string>(category.name);
    const [categoryDescription, setCategoryDescription] = useState<string>(category.description);

    useEffect(() => {
        setCategoryId(category.id);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(category.id, {name: categoryName, description: categoryDescription});
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input type="text" value={categoryId} placeholder="Category Id" className="mb-4"/>
            <Input type="text" value={categoryName} placeholder="Category Name" className="mb-4" onChange={(e) => setCategoryName(e.target.value)}/>
            <Input type="text" value={categoryDescription} placeholder="Category Description" className="mb-4" onChange={(e) => setCategoryDescription(e.target.value)} />
            <Button type="submit" className="w-full">Update</Button>
        </form>
    )
}

export default EditCategoryForm;