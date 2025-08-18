import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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
import { Separator } from "@radix-ui/react-separator";
import CommonForm from "../common/form";
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
} from "lucide-react";

const initialFormData = {
  status: "",
};

// Helper function to get status color and icon
function getStatusDetails(status) {
  switch (status) {
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <ClockIcon className="h-3 w-3" />,
        label: "Pending"
      };
    case "inProcess":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <PackageIcon className="h-3 w-3" />,
        label: "In Process"
      };
    case "inShipping":
      return {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <TruckIcon className="h-3 w-3" />,
        label: "In Shipping"
      };
    case "delivered":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        label: "Delivered"
      };
    case "rejected":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircleIcon className="h-3 w-3" />,
        label: "Rejected"
      };
    case "confirmed":
      return {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <CheckCircleIcon className="h-3 w-3" />,
        label: "Confirmed"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <AlertTriangleIcon className="h-3 w-3" />,
        label: "Unknown"
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
        address: orderDetails?.addressInfo?.address || "",
        city: orderDetails?.addressInfo?.city || "",
        pincode: orderDetails?.addressInfo?.pincode || "",
        phone: orderDetails?.addressInfo?.phone || "",
        notes: orderDetails?.addressInfo?.notes || "",
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
            description: "Order status has been updated successfully" 
          });
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
        } else {
          toast({ 
            title: "Update Failed", 
            description: "Failed to update status",
            variant: "destructive" 
          });
        }
      });
  }

  function handleDeleteOrder() {
    dispatch(deleteOrderForAdmin(orderDetails?._id)).then((res) => {
      if (res.payload?.success) {
        toast({ 
          title: "Order Deleted", 
          description: "Order has been permanently deleted" 
        });
        dispatch(getAllOrdersForAdmin());
        setOpen(false);
      } else {
        toast({ 
          title: "Delete Failed", 
          description: "Failed to delete order",
          variant: "destructive" 
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
            description: "Shipping information has been updated successfully" 
          });
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setIsEditing(false);
        } else {
          toast({ 
            title: "Update Failed", 
            description: "Failed to update order information",
            variant: "destructive" 
          });
        }
      });
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const statusDetails = getStatusDetails(orderDetails?.orderStatus);

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader className="pb-4">
        <DialogTitle className="flex items-center gap-2 text-xl">
          <ShoppingBagIcon className="h-5 w-5" />
          Order Details
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-6">
        {/* Order Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <PackageIcon className="h-4 w-4" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-50">
                  <PackageIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm">{orderDetails?._id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-50">
                  <CalendarIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{orderDetails?.orderDate.split("T")[0]}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-50">
                  <DollarSignIcon className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">${orderDetails?.totalAmount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-50">
                  <CreditCardIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium capitalize">{orderDetails?.paymentMethod}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-50">
                  <CreditCardIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium capitalize">{orderDetails?.paymentStatus}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-50">
                  {statusDetails.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <Badge className={`${statusDetails.color} border font-medium`}>
                    {statusDetails.icon}
                    <span className="ml-1">{statusDetails.label}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBagIcon className="h-4 w-4" />
              Order Items ({orderDetails?.cartItems?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                orderDetails?.cartItems.map((item) => (
                  <Card key={item._id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={item?.image} alt={item?.title} />
                          <AvatarFallback>{item?.title?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item?.title}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>Qty: {item?.quantity}</span>
                            <span>Price: ${item?.price}</span>
                            <span className="font-medium text-gray-900">
                              Total: ${(item?.price * item?.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                Shipping Information
              </CardTitle>
              {!isEditing && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <EditIcon className="h-3 w-3" />
                        Edit
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input 
                      id="address"
                      name="address" 
                      value={editableData?.address || ""} 
                      onChange={handleInputChange} 
                      placeholder="Enter address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input 
                      id="city"
                      name="city" 
                      value={editableData?.city || ""} 
                      onChange={handleInputChange} 
                      placeholder="Enter city"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
                    <Input 
                      id="pincode"
                      name="pincode" 
                      value={editableData?.pincode || ""} 
                      onChange={handleInputChange} 
                      placeholder="Enter pincode"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                    <Input 
                      id="phone"
                      name="phone" 
                      value={editableData?.phone || ""} 
                      onChange={handleInputChange} 
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                  <Input 
                    id="notes"
                    name="notes" 
                    value={editableData?.notes || ""} 
                    onChange={handleInputChange} 
                    placeholder="Enter additional notes"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2"
                  >
                    <XIcon className="h-3 w-3" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2"
                  >
                    <SaveIcon className="h-3 w-3" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{user?.userName}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="space-y-1">
                    <p>{orderDetails?.addressInfo?.address}</p>
                    <p>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  <span>{orderDetails?.addressInfo?.phone}</span>
                </div>
                {orderDetails?.addressInfo?.notes && (
                  <div className="flex items-start gap-3">
                    <div className="h-4 w-4 text-gray-500 mt-0.5">📝</div>
                    <p className="text-sm text-gray-600">{orderDetails?.addressInfo?.notes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <EditIcon className="h-4 w-4" />
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
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
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

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangleIcon className="h-4 w-4" />
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
                    <TrashIcon className="h-3 w-3" />
                    Delete Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangleIcon className="h-5 w-5 text-red-500" />
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
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
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
    </DialogContent>
  );
}

export default AdminOrderDetailsView;