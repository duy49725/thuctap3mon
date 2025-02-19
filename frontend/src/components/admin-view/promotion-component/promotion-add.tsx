import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"

export interface PromotionForm {
    name: string;
    description: string;
    discountAmount: number;
    discountType: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

interface AddPromotionFormProps {
    onAdd: (promotion: PromotionForm) => void;
}

export const promotionInitial: PromotionForm = {
    name: '',
    description: '',
    discountAmount: 0,
    discountType: '',
    startDate: new Date(),
    endDate: new Date(),
    isActive: false
}

const AddPromotionForm = ({ onAdd }: AddPromotionFormProps) => {
    const [promotion, setPromotion] = useState<PromotionForm>(promotionInitial);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(promotion);
        setPromotion(promotionInitial);
    }
    return (
        <form className="w-[500px]" onSubmit={handleSubmit}>
            <Input
                type="text"
                value={promotion.name}
                onChange={(e) => setPromotion({ ...promotion, name: e.target.value })}
                placeholder="Promotion Name"
                className="mb-4"
            />

            <Input
                type="text"
                value={promotion.description}
                onChange={(e) => setPromotion({ ...promotion, description: e.target.value })}
                placeholder="Promotion Description"
                className="mb-4"
            />

            <Input
                type="number"
                value={promotion.discountAmount}
                onChange={(e) => setPromotion({ ...promotion, discountAmount: Number(e.target.value) })}
                placeholder="Promotion Amount"
                className="mb-4"
            />

            <Input
                type="text"
                value={promotion.discountType}
                onChange={(e) => setPromotion({ ...promotion, discountType: e.target.value })}
                placeholder="Promotion Type"
                className="mb-4"
            />

            <Input
                type="date"
                value={promotion.startDate.toISOString().split('T')[0]}
                onChange={(e) => setPromotion({ ...promotion, startDate: new Date(e.target.value) })}
                placeholder="Promotion Start Date"
                className="mb-4"
            />

            <Input
                type="date"
                value={promotion.endDate.toISOString().split('T')[0]}
                onChange={(e) => setPromotion({ ...promotion, endDate: new Date(e.target.value) })}
                placeholder="Promotion End Date"
                className="mb-4"
            />

            <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="terms2" onCheckedChange={(checked) => setPromotion({...promotion, isActive: Boolean(checked)})} />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Promotion Active
                </label>
            </div>

            <Button type="submit" className="w-full">Submit</Button>
        </form>
    )
}

export default AddPromotionForm;