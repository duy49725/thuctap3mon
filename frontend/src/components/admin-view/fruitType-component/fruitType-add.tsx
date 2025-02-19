import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddFruitTypeFormProps{
    onAdd: (category: {name: string, description: string}) => void;
}

const AddFruitTypeForm = ({onAdd}: AddFruitTypeFormProps) => {
    const [fruitTypeName, setFruitTypeName] = useState<string>('');
    const [fruitTypeDescription, setFruitTypeDescription] = useState<string>('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({name: fruitTypeName, description: fruitTypeDescription});
        setFruitTypeName('');
        setFruitTypeDescription('');
    }

    return(
        <form onSubmit={handleSubmit}>
            <Input type="text" value={fruitTypeName} onChange={(e) => setFruitTypeName(e.target.value)} placeholder="Fruit Type Name" className="mb-4" />
            <Input type="text" value={fruitTypeDescription} onChange={(e) => setFruitTypeDescription(e.target.value)} placeholder="Fruit Type Description" className="mb-4" />
            <Button type="submit" className="w-full">Add Fruit Type</Button>
        </form>
    )
} 

export default AddFruitTypeForm;