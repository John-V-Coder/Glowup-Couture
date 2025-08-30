import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { addressFormControls } from "@/config";
import AddressCard from "./address-card";

// UPDATED: Added userName to the initial form data
const initialAddressFormData = {
  userName: "", // <-- ADDED
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({
  setCurrentSelectedAddress,
  selectedId,
  editingAddress,
  onAddressSubmit,
  compact = false,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  useEffect(() => {
    if (editingAddress) {
      setCurrentEditedId(editingAddress._id);
      setFormData({
        userName: editingAddress.userName || "",
        address: editingAddress.address || "",
        city: editingAddress.city || "",
        phone: editingAddress.phone || "",
        pincode: editingAddress.pincode || "",
        notes: editingAddress.notes || "",
      });
    } else {
      setCurrentEditedId(null);
      setFormData(initialAddressFormData);
    }
  }, [editingAddress]);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    const action =
      currentEditedId !== null
        ? editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        : addNewAddress({
            ...formData,
            userId: user?.id,
          });

    dispatch(action).then((res) => {
      if (res.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        const successMessage =
          currentEditedId !== null
            ? "Address updated successfully"
            : "Address added successfully";
        toast({ title: successMessage });

        setCurrentEditedId(null);
        setFormData(initialAddressFormData);

        if (onAddressSubmit) {
          onAddressSubmit(res.payload.data);
        }
      }
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      userName: getCuurentAddress?.userName, // <-- ADDED: Populate the form with the user's name
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    // UPDATED: Check for all fields, including userName
    const { userName, address, city, phone } = formData;
    return (
      userName.trim() !== "" &&
      address.trim() !== "" &&
      city.trim() !== "" &&
      phone.trim() !== ""
    );
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user?.id));
    }
  }, [dispatch, user?.id]);

  console.log(addressList, "addressList");

  if (compact) {
    return (
      <form onSubmit={handleManageAddress} className="space-y-4">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={!isFormValid()}>
            {currentEditedId !== null ? "Update Address" : "Add Address"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id} // ADDED key prop for list rendering
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;