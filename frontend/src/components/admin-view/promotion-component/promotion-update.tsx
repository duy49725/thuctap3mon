import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromotionForm, promotionInitial } from "./promotion-add";
import { Checkbox } from "@/components/ui/checkbox";

export interface EditPromotionForm extends PromotionForm{
    id: number
}

const promotionEditInitial: EditPromotionForm = {
    id: 0,
    ...promotionInitial
}

interface EditPromotionFormProps{
    promotion: EditPromotionForm,
    onSave: (id: number, data: PromotionForm) => void;
}

const UpdatePromotionForm = ({promotion, onSave}: EditPromotionFormProps) => {
    const [promotionForm, setPromotionForm] = useState<EditPromotionForm>(promotion);
    useEffect(() => {
        setPromotionForm(promotion);
    }, [promotion]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(promotion.id, promotionForm)
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <Input 
                type="text" 
                value={promotionForm.id} 
                placeholder="Promotion Id"
                className="mb-4"
             />

             <Input 
                type="text"
                value={promotionForm.name}
                placeholder="Promotion Name"
                onChange={(e) => setPromotionForm({...promotionForm, name: e.target.value})}
                className="mb-4"
             />

             <Input 
                type="text"
                value={promotionForm.description}
                placeholder="Promotion Description"
                onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                className="mb-4"
             />

             <Input 
                type="number"
                value={promotionForm.discountAmount}
                placeholder="Promotion Discount Amount"
                onChange={(e) => setPromotionForm({...promotionForm, discountAmount: Number(e.target.value)})}
                className="mb-4"
             />

             <Input 
                type="text"
                value={promotionForm.discountType}
                placeholder="Promotion Discount Type"
                onChange={(e) => setPromotionForm({...promotionForm, discountType: e.target.value})}
                className="mb-4"
             />

             <Input 
                type="date"
                value={promotionForm.startDate.toISOString().split("T")[0]}
                onChange={(e) => setPromotionForm({...promotionForm, startDate: new Date(e.target.value)})}
                placeholder="Promotion Start Date"
                className="mb-4"
             />

             <Input 
                type="date"
                value={promotionForm.endDate.toISOString().split("T")[0]}
                onChange={(e) => setPromotionForm({...promotionForm, endDate: new Date(e.target.value)})}
                placeholder="Promotion End Date"
                className="mb-4"
             />

             <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="promotionChecked" checked={promotionForm.isActive} onCheckedChange={(checked) => setPromotionForm({...promotionForm, isActive: Boolean(checked)})}/>
                <label htmlFor="promotionChecked" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> 
                    Promotion Active
                </label>
             </div>

             <Button type="submit" className="w-full">Submit</Button>
        </form>
    )
}

export default UpdatePromotionForm;