import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DiscountCode } from "@/config/entity";

interface DiscountCodeListProps{
    discounts: DiscountCode[];
    onEdit: (discountCode: DiscountCode) => void;
    onDelete: (id: number) => void;
}

const DiscountCodeList = ({discounts, onEdit, onDelete}: DiscountCodeListProps) => {
    return(
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Min Order Value</TableHead>
                        <TableHead>Max User</TableHead>
                        <TableHead>Used Count</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        discounts.map((discount: DiscountCode) => (
                            <TableRow key={discount.id}>
                                <TableCell>{discount.id}</TableCell>
                                <TableCell>{discount.code}</TableCell>
                                <TableCell>{discount.amount}</TableCell>
                                <TableCell>{discount.type}</TableCell>
                                <TableCell>{discount.minOrderValue}</TableCell>
                                <TableCell>{discount.maxUser}</TableCell>
                                <TableCell>{discount.usedCount}</TableCell>
                                <TableCell>{new Date(discount.startDate).toISOString().split('T')[0]}</TableCell>
                                <TableCell>{new Date(discount.endDate).toISOString().split('T')[0]}</TableCell>
                                <TableCell>
                                    <Checkbox checked={Boolean(discount.isActive)} />
                                </TableCell>
                                <TableCell>
                                    <Button className="mr-2" onClick={() => onEdit(discount)}>Edit</Button>
                                    <Button onClick={() => onDelete(discount.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default DiscountCodeList;