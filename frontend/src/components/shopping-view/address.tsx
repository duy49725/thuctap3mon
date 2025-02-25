import { ShippingAddress } from '@/config/entity';
import { useToast } from '@/hooks/use-toast';
import { addShippingAddress, deleteShippingAddress, fetchAllShippingAddress, updateShippingAddress } from '@/store/shopping/address-slice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AddressCard from './address-card';
import AddressForm from './address-from';

const initialForm: Omit<ShippingAddress, 'id' | 'user_id'> = {
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  is_default: false,
  phoneNumber: 0,
  note: ''
}
interface ShoppingAddressProps {
  selectedId: ShippingAddress | undefined;
  setCurrentSelectedAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
}

const ShoppingAddress = ({ selectedId, setCurrentSelectedAddress }: ShoppingAddressProps) => {
  const { user } = useSelector((state: RootState) => state.adminAuth);
  const { addressList } = useSelector((state: RootState) => state.shoppAddress);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [limit, setLimit] = useState<number>(3);
  const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);
  const [initialAddressForm, setInitialAddressForm] = useState<Omit<ShippingAddress, 'id' | 'user_id'>>(initialForm);
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchAllShippingAddress({ page: 1, limit: limit, userId: user.userId }));
    }
  }, [dispatch, user?.userId, limit]);
  function handleManageAddress(formData: Omit<ShippingAddress, 'id' | 'user_id'>) {
    currentEditedId !== null
      ? dispatch(updateShippingAddress({ id: currentEditedId, userId: user.userId, formData }))
        .then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllShippingAddress({ page: 1, limit: limit, userId: user.userId }))
            setCurrentEditedId(null)
            toast({
              title: "Address updated successfully"
            })
          }
        })
      : dispatch(addShippingAddress({ userId: user.userId, formData }))
        .then((data) => {
          if (data.payload.success) {
            dispatch(fetchAllShippingAddress({ page: 1, limit: limit, userId: user.userId }))
            setCurrentEditedId(null)
            toast({
              title: "Address added successfully"
            })
          }
        })
  }
  function handleEditAddress(getCurrentAddress: ShippingAddress) {
    setCurrentEditedId(getCurrentAddress.id);
    setInitialAddressForm({
      ...initialAddressForm,
      ...getCurrentAddress
    })
  }
  function handleDeleteAddress(getCurrentAddress: ShippingAddress) {
    dispatch(deleteShippingAddress(getCurrentAddress.id))
      .then((data) => {
        if (data.payload.success) {
          dispatch(fetchAllShippingAddress({ page: 1, limit: limit, userId: user.userId }))
          toast({
            title: "Address deleted successfully"
          })
        }
      })
  }
  console.log(initialAddressForm);
  return (
    <Card>
      <div className='mb-5 p-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
        {
          addressList && addressList.length > 0
            ? addressList.map((singleAddressItem) => (
              <>
                <AddressCard
                  selectedId={selectedId}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  addressInfor={singleAddressItem}
                  handleDeleteAddress={handleDeleteAddress}
                  handleEditAddress={handleEditAddress}
                />
              </>

            ))
            : null
        }
      </div>
      {limit && (
          <p
            className='w-full text-center mt-2 w-full cursor-pointer hover:opacity-50'
            onClick={() => {
              setLimit((prevLimit) => prevLimit + 3);
            }}
          >
            Show more result
          </p>
        )}
      <CardHeader>
        <CardTitle>
          {currentEditedId != null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AddressForm
          initialAddressForm={initialAddressForm}
          setInitialAddressForm={setInitialAddressForm}
          handleManageAddress={handleManageAddress}
        />
      </CardContent>
    </Card>
  )
}

export default ShoppingAddress;