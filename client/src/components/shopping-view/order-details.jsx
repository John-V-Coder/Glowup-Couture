import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth || {});

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get badge color based on status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-600";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-purple-500";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="space-y-6 p-1">
        {/* Order Summary Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium text-gray-800 break-all">{orderDetails?._id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-800">{formatDate(orderDetails?.orderDate)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-gray-800">{formatCurrency(orderDetails?.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-800 capitalize">
                  {orderDetails?.paymentMethod?.replace(/_/g, " ") || "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <Badge
                variant="outline"
                className={`capitalize ${
                  orderDetails?.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {orderDetails?.paymentStatus || "N/A"}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <Badge className={`capitalize py-1 px-3 text-white ${getStatusColor(orderDetails?.orderStatus)}`}>
                {orderDetails?.orderStatus || "N/A"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
          
          <div className="space-y-3">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={item.image || '/placeholder-image.jpg'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    {item.images?.length > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gray-100 text-gray-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        +{item.images.length}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-gray-600">|</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-800">
                      Subtotal: {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No items found in this order</p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Shipping Info Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Shipping Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Recipient</p>
              <p className="font-medium text-gray-800">{user?.userName || "N/A"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium text-gray-800">
                {orderDetails?.addressInfo?.phone || "N/A"}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="font-medium text-gray-800">
              {[
                orderDetails?.addressInfo?.address,
                orderDetails?.addressInfo?.city,
                orderDetails?.addressInfo?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
          
          {orderDetails?.addressInfo?.notes && (
            <div>
              <p className="text-sm text-gray-500">Delivery Notes</p>
              <p className="font-medium text-gray-800">
                {orderDetails.addressInfo.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;