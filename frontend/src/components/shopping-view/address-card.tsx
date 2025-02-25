import React from 'react'
import { ShippingAddress } from '@/config/entity';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

interface AddressCardProps {
  addressInfor: ShippingAddress;
  handleDeleteAddress: (getCurrentAddress: ShippingAddress) => void;
  handleEditAddress: (getCurrentAddress: ShippingAddress) => void;
  selectedId: ShippingAddress | undefined;
  setCurrentSelectedAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
}

const AddressCard = ({ selectedId, setCurrentSelectedAddress, addressInfor, handleEditAddress, handleDeleteAddress }: AddressCardProps) => {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfor)
          : undefined
      }
      className={`cursor-pointer border-red-700 ${selectedId?.id === addressInfor?.id
        ? "border-red-900 border-[4px]"
        : "border-black"
        }`}
    >
      <CardContent className='grid p-4 gap-4'>
        <label>Full Name: {addressInfor.fullName}</label>
        <label>Street Address: {addressInfor.streetAddress}</label>
        <label>City: {addressInfor.city}</label>
        <label>State: {addressInfor.state}</label>
        <label>Postal Code: {addressInfor.postal_code}</label>
        <label>Country: {addressInfor.country}</label>
        <label className='flex items-center gap-2'>
          Is Default: <Checkbox checked={addressInfor.is_default} />
        </label>
        <label>Phone Number: {addressInfor.phoneNumber}</label>
        <label>Note: {addressInfor.note}</label>
      </CardContent>
      <CardFooter className='p-3 flex justify-between'>
        <Button onClick={() => handleEditAddress(addressInfor)}>Edit</Button>
        <Button onClick={(e) => {
          handleDeleteAddress(addressInfor);
        }}>
          Delete
        </Button>      
      </CardFooter>
    </Card>
  )
}

export default AddressCard;