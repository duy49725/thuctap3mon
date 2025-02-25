import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserToManage, UserToManageResponse } from "@/config/entity";

interface UserListProps{
    users: UserToManageResponse[];
    onEdit: (user: UserToManageResponse) => void;
    onDelete: (id: string) => void;
}

const UserList = ({users, onEdit, onDelete}: UserListProps) => {
    return(
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>FullName</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Is Verifiled</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>
                                    <AspectRatio ratio={16/9}>
                                        <img src={String(user.avatar)} alt="" width={400}/>
                                    </AspectRatio>
                                </TableCell>
                                <TableCell>
                                    <Checkbox checked={Boolean(user.isVerified)} />
                                </TableCell>
                                <TableCell>
                                    <Checkbox checked={Boolean(user.isActive)} />
                                </TableCell>
                                <TableCell>
                                    {
                                        user.roles.map(role => (
                                            <span>{role.roleName}, </span>
                                        ))
                                    }
                                </TableCell>
                                <TableCell>
                                    <Button className="mr-2" onClick={() => onEdit(user)}>Edit</Button>
                                    <Button onClick={() => onDelete(user.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default UserList;