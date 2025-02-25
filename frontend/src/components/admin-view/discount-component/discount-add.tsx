import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DiscountCode } from "@/config/entity";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AddDiscountFormProps {
    onAdd: (discountCode: Omit<DiscountCode, 'id'>) => void;
}

const initialDiscountForm = {
    code: '',
    amount: 0,
    type: '',
    minOrderValue: 0,
    maxUser: 0,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: false
}

const AddDiscountCodeForm = ({ onAdd }: AddDiscountFormProps) => {
    const [discountForm, setDiscountForm] = useState<Omit<DiscountCode, 'id'>>(initialDiscountForm);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(discountForm);
        setDiscountForm(initialDiscountForm);
    }

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Discount Code</Label>
                <Input
                    type="text"
                    value={discountForm.code}
                    onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value })}
                />
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Amount</Label>
                <Input
                    type="number"
                    value={discountForm.amount}
                    onChange={(e) => setDiscountForm({ ...discountForm, amount: Number(e.target.value) })}
                />
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Discount Type</Label>
                <Select onValueChange={(value) => setDiscountForm({...discountForm, type: String(value)})}>
                    <SelectTrigger>
                        <SelectValue placeholder="Discount Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Discount min order value</Label>
                <Input
                    type="number"
                    value={discountForm.minOrderValue}
                    onChange={(e) => setDiscountForm({ ...discountForm, minOrderValue: Number(e.target.value) })}
                />
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Discount max user</Label>
                <Input
                    type="number"
                    value={discountForm.maxUser}
                    onChange={(e) => setDiscountForm({ ...discountForm, maxUser: Number(e.target.value) })}
                />
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Used Count</Label>
                <Input 
                    type="number"
                    value={discountForm.usedCount}
                    onChange={(e) => setDiscountForm({...discountForm, usedCount: Number(e.target.value)})}
                />
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>Start Date</Label>
                <Input
                    type="date"
                    value={discountForm.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setDiscountForm({ ...discountForm, startDate: new Date(e.target.value) })}
                />
            </div>
            <div className="mb-4 flex flex-col gap-4">
                <Label>End Date</Label>
                <Input
                    type="date"
                    value={discountForm.endDate.toISOString().split('T')[0]}
                    onChange={(e) => setDiscountForm({ ...discountForm, endDate: new Date(e.target.value) })}
                />
            </div>
            <div className="mb-4 flex item-center space-x-2">
                <Checkbox 
                    id="term2"
                    onCheckedChange={(checked) => setDiscountForm({...discountForm, isActive: Boolean(checked)})}
                />
                 <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Discount Code Active
                </label>
            </div>
            <Button type="submit" className="w-full">Submit</Button>
        </form>
    )
}

export default AddDiscountCodeForm;