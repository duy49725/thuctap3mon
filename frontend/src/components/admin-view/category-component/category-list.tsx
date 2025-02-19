import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface Category{
    id: number;
    name: string;
    description: string;
}

interface CategoryListProps{
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

const CategoryList = ({categories, onEdit, onDelete}: CategoryListProps) => {
    return(
        <div className="overflow-auto">
            <Table className="min-w-full bg-white shadow-md rounded-lg">
                <TableBody>
                    {
                        categories.map((category: Category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Button className="mr-2" onClick={() => onEdit(category)}>Edit</Button>
                                    <Button onClick={() => onDelete(category.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CategoryList;