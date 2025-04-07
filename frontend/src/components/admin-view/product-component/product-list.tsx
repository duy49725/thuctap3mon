import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductResponse } from "@/config/entity";

interface ProductListProps{
    products: ProductResponse[];
    onEdit: (product: ProductResponse) => void;
    onDelete: (id: number) => void;
}

const ProductList = ({products, onEdit, onDelete}: ProductListProps) =>{
    return(
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Fruit Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        products.map((product) => (
                            <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product?.name}</TableCell>
                                    <TableCell>{product?.fruitType?.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell className="overflow-hidden">
                                        <AspectRatio ratio={16/9}>
                                            <img src={String(product.image)} alt="" width={400}/>
                                        </AspectRatio>
                                    </TableCell>
                                    <TableCell>{product.unit}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>
                                        <Checkbox checked={Boolean(product.isActive)} />
                                    </TableCell>
                                    <TableCell>
                                        <Button className="mr-2" onClick={() => onEdit(product)}>Edit</Button>
                                        <Button onClick={() => onDelete(product.id)}>Delete</Button>
                                    </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ProductList;