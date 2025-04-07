import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ShippingAddress } from '@/config/entity'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'


interface AddressFormProps{
    handleManageAddress: (formData: Omit<ShippingAddress, 'id' | 'user_id'>) => void;
    initialAddressForm: Omit<ShippingAddress, 'id' | 'user_id'>;
    setInitialAddressForm: (init: Omit<ShippingAddress, 'id' | 'user_id'>) => void;
}

const AddressForm = ({handleManageAddress, initialAddressForm, setInitialAddressForm}: AddressFormProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleManageAddress(initialAddressForm)
    }
    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
                <Label>Full Name</Label>
                <Input
                    type='text'
                    value={initialAddressForm.fullName}
                    placeholder='Enter Full Name'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, fullName: e.target.value })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Street Address</Label>
                <Input
                    type='text'
                    value={initialAddressForm.streetAddress}
                    placeholder='Enter Street Address'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, streetAddress: e.target.value })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>City</Label>
                <Input
                    type='text'
                    value={initialAddressForm.city}
                    placeholder='Enter City'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, city: e.target.value })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>State</Label>
                <Input
                    type='text'
                    value={initialAddressForm.state}
                    placeholder='Enter State'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, state: e.target.value })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Postal Code</Label>
                <Input
                    type='text'
                    value={initialAddressForm.postal_code}
                    placeholder='Enter Postal Code'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, postal_code: e.target.value })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Country</Label>
                <Input
                    type='text'
                    value={initialAddressForm.country}
                    placeholder='Enter Country'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, country: e.target.value })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Phone Number</Label>
                <Input
                    type='number'
                    value={initialAddressForm.phoneNumber}
                    placeholder='Enter Number'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, phoneNumber: Number(e.target.value) })}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Note</Label>
                <Input
                    type='text'
                    value={initialAddressForm.note}
                    placeholder='Enter Note'
                    onChange={(e) => setInitialAddressForm({ ...initialAddressForm, note: e.target.value })}
                />
            </div>
            <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="terms2" checked={initialAddressForm.is_default} onCheckedChange={(checked) => setInitialAddressForm({ ...initialAddressForm, is_default: Boolean(checked) })} />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Is Default
                </label>
            </div>
            <Button type='submit'>Submit</Button>
        </form>
    )
}

export default AddressForm