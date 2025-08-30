import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrderForAdmin,
  updateOrderForAdmin,
} from "@/store/admin/order-slice";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  TrashIcon,
  DollarSignIcon,
  CircleDotDashedIcon,
  ThumbsUpIcon,
} from "lucide-react";
import CommonForm from "../common/form";

const initialFormData = {
  status: "",
};

// 📍 Change: Added a new helper function to get payment status details
function getPaymentStatusDetails(status) {
  switch (status?.toLowerCase()) {
    case "success":
      return { color: "bg-green-100 text-green-800", icon: <CheckCircleIcon className="h-3 w-3" />, label: "Success" };
    case "pending":
      return { color: "bg-yellow-100 text-yellow-800", icon: <ClockIcon className="h-3 w-3" />, label: "Pending" };
    case "failed":
      return { color: "bg-red-100 text-red-800", icon: <XCircleIcon className="h-3 w-3" />, label: "Failed" };
    case "abandoned":
      return { color: "bg-slate-100 text-slate-800", icon: <AlertTriangleIcon className="h-3 w-3" />, label: "Abandoned" };
    default:
      return { color: "bg-gray-100 text-gray-800", icon: <AlertTriangleIcon className="h-3 w-3" />, label: "Unknown" };
  }
}

// Helper function to get order status color and icon
function getOrderStatusDetails(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <ClockIcon className="h-3 w-3" />,
        label: "Pending",
      };
    case "processing": // 📍 Change: Updated status name to match schema
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CircleDotDashedIcon className="h-3 w-3" />,
        label: "Processing",
      };
    case "shipped": // 📍 Change: Updated status name to match schema
      return {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <TruckIcon className="h-3 w-3" />,
        label: "Shipped",
      };
    case "delivered":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        label: "Delivered",
      };
    case "cancelled": // 📍 Change: Updated status name to match schema
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircleIcon className="h-3 w-3" />,
        label: "Cancelled",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <AlertTriangleIcon className="h-3 w-3" />,
        label: "Unknown",
      };
  }
}

function AdminOrderDetailsView({ orderDetails, setOpen }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Initialize editableData when orderDetails are available or change
  useEffect(() => {
    if (orderDetails) {
      setEditableData({
        // 📍 Change: Added userName to editable data
        userName: orderDetails?.userId?.userName || "",
        address: orderDetails?.addressInfo?.address || "",
        city: orderDetails?.addressInfo?.city || "",
        pincode: orderDetails?.addressInfo?.pincode || "",
        phone: orderDetails?.addressInfo?.phone || "",
        notes: orderDetails?.addressInfo?.notes || "",
        // 📍 Change: Added new fields to editable data
        shipmentMethod: orderDetails?.shipmentMethod || "",
        authorizationCode: orderDetails?.billing?.authorizationCode || "",
        paypalReference: orderDetails?.billing?.paypalReference || "",
      });
    }
  }, [orderDetails]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    if (!status) {
      return toast({ title: "Please select a status", variant: "destructive" });
    }
    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status }))
      .then((res) => {
        if (res.payload?.success) {
          toast({
            title: "Status Updated",
            description: "Order status has been updated successfully",
          });
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
        } else {
          toast({
            title: "Update Failed",
            description: "Failed to update status",
            variant: "destructive",
          });
        }
      });
  }

  function handleDeleteOrder() {
    dispatch(deleteOrderForAdmin(orderDetails?._id)).then((res) => {
      if (res.payload?.success) {
        toast({
          title: "Order Deleted",
          description: "Order has been permanently deleted",
        });
        dispatch(getAllOrdersForAdmin());
        setOpen(false);
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    });
  }

  function handleSaveChanges() {
    dispatch(updateOrderForAdmin({ id: orderDetails?._id, data: editableData }))
      .then((res) => {
        if (res.payload?.success) {
          toast({
            title: "Information Updated",
            description: "Shipping and billing information has been updated successfully",
          });
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setIsEditing(false);
        } else {
          toast({
            title: "Update Failed",
            description: "Failed to update order information",
            variant: "destructive",
          });
        }
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const orderStatusDetails = getOrderStatusDetails(orderDetails?.orderStatus);
  // 📍 Change: Get details for payment status
  const paymentStatusDetails = getPaymentStatusDetails(orderDetails?.billing?.paymentStatus);

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <ShoppingBagIcon className="h-6 w-6" />
          Order #{orderDetails?._id?.slice(-8)}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-6">
        {/* Order Summary Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <PackageIcon className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Order ID</Label>
              <p className="font-mono text-sm">{orderDetails?._id}</p>
            </div>
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Order Date</Label>
              <p className="font-medium text-sm">{orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Total Amount</Label>
              <p className="font-bold text-lg text-emerald-600">${orderDetails?.billing?.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
            {/* 📍 Change: Display shipment method */}
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Shipment Method</Label>
              <p className="font-medium capitalize text-sm">{orderDetails?.shipmentMethod || 'N/A'}</p>
            </div>
            {/* 📍 Change: Display payment method */}
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Payment Method</Label>
              <p className="font-medium capitalize text-sm">{orderDetails?.billing?.paymentMethod || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Order Status</Label>
              <Badge className={`${orderStatusDetails.color} border font-medium w-fit`}>
                {orderStatusDetails.icon}
                <span className="ml-1">{orderStatusDetails.label}</span>
              </Badge>
            </div>
            {/* 📍 Change: Display payment status */}
            <div className="flex flex-col">
              <Label className="text-xs text-gray-500">Payment Status</Label>
              <Badge className={`${paymentStatusDetails.color} border font-medium w-fit`}>
                {paymentStatusDetails.icon}
                <span className="ml-1">{paymentStatusDetails.label}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Billing Information Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <MapPinIcon className="h-5 w-5" />
                Shipping & Billing
              </CardTitle>
              {!isEditing && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                        className="h-8 w-8 text-primary"
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit shipping information</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              // 📍 Change: Added new editable fields including userName
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">User Name</Label>
                  <Input id="userName" name="userName" value={editableData?.userName || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={editableData?.address || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={editableData?.city || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" name="pincode" value={editableData?.pincode || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={editableData?.phone || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" value={editableData?.notes || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipmentMethod">Shipment Method</Label>
                  <Input id="shipmentMethod" name="shipmentMethod" value={editableData?.shipmentMethod || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalReference">PayPal Reference</Label>
                  <Input id="paypalReference" name="paypalReference" value={editableData?.paypalReference || ""} onChange={handleInputChange} />
                </div>
                <div className="flex justify-end gap-2 md:col-span-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <XIcon className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              // 📍 Change: Updated the display to show userName
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{orderDetails?.userId?.userName || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="space-y-1 text-sm">
                      <p>{orderDetails?.addressInfo?.address}</p>
                      <p>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    <span>{orderDetails?.addressInfo?.phone}</span>
                  </div>
                  {orderDetails?.addressInfo?.notes && (
                    <div className="flex items-start gap-3">
                      <span className="h-4 w-4 text-gray-500 mt-0.5">📝</span>
                      <p className="text-sm text-gray-600">{orderDetails.addressInfo.notes}</p>
                    </div>
                  )}
                </div>
                {/* 📍 Change: Display billing information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm capitalize">{orderDetails?.billing?.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSignIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-bold text-emerald-600">Total: ${orderDetails?.billing?.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  {orderDetails?.billing?.paypalReference && (
                    <div className="flex items-start gap-3 text-sm">
                      <span className="font-medium text-gray-500 w-24 flex-shrink-0">PayPal Ref:</span>
                      <p className="font-mono break-all">{orderDetails.billing.paypalReference}</p>
                    </div>
                  )}
                  {orderDetails?.billing?.authorizationCode && (
                    <div className="flex items-start gap-3 text-sm">
                      <span className="font-medium text-gray-500 w-24 flex-shrink-0">Auth Code:</span>
                      <p className="font-mono break-all">{orderDetails.billing.authorizationCode}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <ShoppingBagIcon className="h-5 w-5" />
              Order Items ({orderDetails?.cartItems?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item) => (
                <Card key={item._id} className="border-l-4 border-l-blue-500 transition-shadow hover:shadow-lg">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-lg">
                      <AvatarImage src={item?.image} alt={item?.title} />
                      <AvatarFallback>{item?.title?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-lg">{item?.title}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>Qty: <span className="font-semibold">{item?.quantity}</span></span>
                        <span>Price: <span className="font-semibold">${item?.price}</span></span>
                        <span className="font-bold text-gray-900">
                          Total: <span className="text-primary">${(item?.price * item?.quantity).toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No items found</p>
            )}
          </CardContent>
        </Card>

        {/* Status Update & Danger Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <EditIcon className="h-5 w-5" />
                Update Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommonForm
                formControls={[
                  {
                    label: "Order Status",
                    name: "status",
                    componentType: "select",
                    options: [
                      { id: "Pending", label: "Pending" },
                      { id: "Processing", label: "Processing" },
                      { id: "Shipped", label: "Shipped" },
                      { id: "Delivered", label: "Delivered" },
                      { id: "Cancelled", label: "Cancelled" },
                    ],
                  },
                ]}
                formData={formData}
                setFormData={setFormData}
                buttonText="Update Order Status"
                onSubmit={handleUpdateStatus}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md border border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertTriangleIcon className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-medium text-red-800">Delete Order</h4>
                  <p className="text-sm text-red-600 mt-1">
                    This action cannot be undone. This will permanently delete the order.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangleIcon className="h-6 w-6 text-red-500" />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete order{" "}
                        <span className="font-mono font-medium">#{orderDetails?._id?.slice(-8)}</span>{" "}
                        and remove all its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteOrder}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Yes, delete order
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;