import React, {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditFruitTypeFormProps{
    fruitType: {id: number, name: string, description: string},
    onSave: (id: number, data: {name: string; description: string}) => void;
}

const EditFruitTypeForm = ({fruitType, onSave}: EditFruitTypeFormProps) => {
    const [fruitTypeId, setFruitTypeId] = useState<number>(fruitType.id);
    const [fruitTypeName, setFruitTypeName] = useState<string>(fruitType.name);
    const [fruitTypeDescription, setFruitTypeDescription] = useState<string>(fruitType.description);

    useEffect(() => {
        setFruitTypeId(fruitType.id);
        setFruitTypeName(fruitType.name);
        setFruitTypeDescription(fruitType.description);
    }, [fruitType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(fruitType.id, {name: fruitTypeName, description: fruitTypeDescription});
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input type="text" value={fruitTypeId} placeholder="Fruit Type ID" className="mb-4" />
            <Input type="text" value={fruitTypeName} placeholder="Fruit Type Name" className="mb-4" onChange={(e) => setFruitTypeName(e.target.value)} />
            <Input type="text" value={fruitTypeDescription} placeholder="Fruit Type Description" className="mb-4" onChange={(e) => setFruitTypeDescription(e.target.value)}/>
            <Button type="submit">Update Fruit Type</Button>
        </form>
    )
}

export default EditFruitTypeForm;