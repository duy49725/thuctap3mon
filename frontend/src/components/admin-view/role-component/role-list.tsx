import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Role } from "@/config/entity";

interface RoleListProps{
    roles: Role[];
    onEdit: (role: Role) => void;
    onDelete: (id: number) => void;
}

const RoleList = ({roles, onEdit, onDelete}: RoleListProps) => {
    return(
        <div className="overflow-auto">
            <Table className="min-w-full bg-white shadow-md rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        roles.map((role: Role) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.id}</TableCell>
                                <TableCell>{role.roleName}</TableCell>
                                <TableCell>
                                    <Button className="mr-2" onClick={() => onEdit(role)}>Edit</Button>
                                    <Button onClick={() => onDelete(role.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default RoleList;