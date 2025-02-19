import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FruitType {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface FruitTypeListProps {
    fruitTypes: FruitType[];
    onEdit: (fruitType: FruitType) => void;
    onDelete: (id: number) => void;
}

const FruitTypeList = ({ fruitTypes, onEdit, onDelete }: FruitTypeListProps) => {
    console.log(fruitTypes);
    return (
        <div className="overflow-auto">
            <Table className="min-w-full bg-white shadow-md rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        fruitTypes.map((fruitType: FruitType) => (
                            <TableRow key={fruitType.id}>
                                <TableCell>{fruitType.id}</TableCell>
                                <TableCell>{fruitType.name}</TableCell>
                                <TableCell>{fruitType.description}</TableCell>
                                <TableCell>{fruitType.createdAt.toLocaleString()}</TableCell>
                                <TableCell>{fruitType.updatedAt.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button className="mr-2" onClick={() => onEdit(fruitType)}>Edit</Button>
                                    <Button onClick={() => onDelete(fruitType.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default FruitTypeList;