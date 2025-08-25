import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import ShoppingOrderDetailsView from "./order-details";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice/index";
import { Button } from "../ui/button";
import { Eye, CheckCircleIcon, XCircleIcon, ClockIcon, PackageIcon } from "lucide-react";

// Helper function to get status details (color, icon, label)
function getStatusDetails(status) {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return { label: "Confirmed", color: "bg-green-600", icon: <CheckCircleIcon className="h-3 w-3 mr-1" /> };
    case "rejected":
      return { label: "Rejected", color: "bg-red-600", icon: <XCircleIcon className="h-3 w-3 mr-1" /> };
    case "inprocess":
      return { label: "In Process", color: "bg-blue-600", icon: <PackageIcon className="h-3 w-3 mr-1" /> };
    case "shipped":
      return { label: "Shipped", color: "bg-purple-600", icon: <PackageIcon className="h-3 w-3 mr-1" /> };
    case "delivered":
      return { label: "Delivered", color: "bg-emerald-600", icon: <CheckCircleIcon className="h-3 w-3 mr-1" /> };
    default:
      return { label: "Pending", color: "bg-gray-500", icon: <ClockIcon className="h-3 w-3 mr-1" /> };
  }
}

function ShoppingOrders() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    if (getId) {
      dispatch(getOrderDetails(getId));
    }
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>Shippment</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => {
                const statusDetails = getStatusDetails(orderItem?.orderStatus);
                return (
                  <TableRow key={orderItem?._id}>
                    <TableCell className="font-mono text-xs md:text-sm">#{orderItem?._id?.slice(-8)}</TableCell>
                    <TableCell className="text-sm">
                      {orderItem?.orderDate ? new Date(orderItem.orderDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`py-1 px-3 text-white ${statusDetails.color}`}>
                        {statusDetails.icon} {statusDetails.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">KES - {orderItem?.billing?.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Dialog onOpenChange={(open) => !open && dispatch(resetOrderDetails())}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            disabled={!orderItem?._id}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </DialogTrigger>
                        {orderDetails && <ShoppingOrderDetailsView orderDetails={orderDetails} />}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  You haven't placed any orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;