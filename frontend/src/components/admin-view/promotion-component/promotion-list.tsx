import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

interface Promotion{
    id: number;
    name: string;
    description: string;
    discountAmount: number;
    discountType: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

interface PromotionListProps{
    promotions: Promotion[];
    onEdit: (promotion: Promotion) => void;
    onDelete: (id: number) => void;
}

const PromotionList = ({promotions, onEdit, onDelete}: PromotionListProps) => {
    return(
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Discount Amount</TableHead>
                        <TableHead>Discount Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        promotions.map((promotion: Promotion) => (
                            <TableRow key={promotion.id}>
                                <TableCell>{promotion.id}</TableCell>
                                <TableCell>{promotion.name}</TableCell>
                                <TableCell>{promotion.description}</TableCell>
                                <TableCell>{promotion.discountAmount}</TableCell>
                                <TableCell>{promotion.discountType}</TableCell>
                                <TableCell>{promotion.startDate.toLocaleString()}</TableCell>
                                <TableCell>{promotion.endDate.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Checkbox checked={Boolean(promotion.isActive)} />
                                </TableCell>
                                <TableCell>
                                    <Button className="mr-2" onClick={() => onEdit(promotion)}>Edit</Button>
                                    <Button onClick={() => onDelete(promotion.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}   

export default PromotionList;