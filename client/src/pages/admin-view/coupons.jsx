import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon,
  fetchAllCoupons,
  updateCoupon,
  deleteCoupon,
  fetchEligibleUsers,
  sendCouponsToUsers,
  getCouponStats,
  clearErrors
} from "@/store/admin/coupon-slice";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Icons
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Gift,
  TrendingUp,
  Target,
  BarChart3,
  Send
} from "lucide-react";

// Optional wrapper
import PageWrapper from "@/components/common/page-wrapper";

const initialFormData = {
  code: "",
  name: "",
  description: "",
  type: "percentage",
  value: "",
  customerType: "general",
  usageLimit: "",
  perUserLimit: "1",
  minimumOrderAmount: "0",
  validFrom: new Date().toISOString().split("T")[0],
  validUntil: "",
  autoAssign: false,
  applicableCategories: [],
  excludedCategories: []
};

function AdminCoupons() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Local UI state
  const [formData, setFormData] = useState(initialFormData);
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null); // used for edit and send
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCustomerType, setFilterCustomerType] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Redux state
  const {
    couponList,
    eligibleUsers,
    couponStats,
    pagination,
    isLoading,
    creatingCoupon,
    updatingCoupon,
    deletingCoupon,
    fetchingEligibleUsers,
    sendingCoupons,
    fetchingStats,
    createError,
    updateError,
    deleteError,
    eligibleUsersError,
    sendCouponsError,
    statsError,
    error
  } = useSelector((state) => state.adminCoupons);

  // Load coupons and stats
  useEffect(() => {
    dispatch(fetchAllCoupons());
    dispatch(getCouponStats());
  }, [dispatch]);

  // Global error handler -> toast + clear
  useEffect(() => {
    const errMsg =
      createError ||
      updateError ||
      deleteError ||
      eligibleUsersError ||
      sendCouponsError ||
      statsError ||
      error;

    if (errMsg) {
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive"
      });
      dispatch(clearErrors());
    }
  }, [
    createError,
    updateError,
    deleteError,
    eligibleUsersError,
    sendCouponsError,
    statsError,
    error,
    toast,
    dispatch
  ]);

  // ------ Create / Update -------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      ...formData,
      value: parseFloat(formData.value),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
      perUserLimit: parseInt(formData.perUserLimit, 10),
      minimumOrderAmount: parseFloat(formData.minimumOrderAmount)
    };

    try {
      if (editingCoupon) {
        await dispatch(
          updateCoupon({ id: editingCoupon._id, couponData })
        ).unwrap();
        toast({ title: "Coupon updated successfully" });
      } else {
        await dispatch(createCoupon(couponData)).unwrap();
        toast({ title: "Coupon created successfully" });
      }
      closeCreateEdit();
      // Refresh list so filters/pagination stay consistent with server
      dispatch(fetchAllCoupons(buildQueryFilters()));
      dispatch(getCouponStats());
    } catch {
      // handled by error effect
    }
  };

  const openCreate = () => {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setIsCreateEditOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      ...coupon,
      validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
      validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
      usageLimit: coupon.usageLimit?.toString() || "",
      perUserLimit: coupon.perUserLimit?.toString() || "1",
      minimumOrderAmount: coupon.minimumOrderAmount?.toString() || "0",
      value: coupon.value?.toString() || ""
    });
    setIsCreateEditOpen(true);
  };

  const closeCreateEdit = () => {
    setIsCreateEditOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormData);
  };

  // ------ Delete -------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      toast({ title: "Coupon deleted successfully" });
      dispatch(fetchAllCoupons(buildQueryFilters()));
      dispatch(getCouponStats());
    } catch {
      // handled by error effect
    }
  };

  // ------ Send coupon -------
  const ensureSendable = (coupon) => {
    const now = new Date();
    const isExpired = new Date(coupon.validUntil) < now;
    if (!coupon.isActive || isExpired) {
      toast({
        title: "Cannot send this coupon",
        description: "The coupon is inactive or expired.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const openSend = async (coupon) => {
    if (!ensureSendable(coupon)) return;
    setEditingCoupon(coupon);
    setSelectedUsers([]);
    setSelectAll(false);
    try {
      await dispatch(fetchEligibleUsers()).unwrap();
      setIsSendOpen(true);
    } catch {
      // handled by error effect
    }
  };

  const closeSend = () => {
    setIsSendOpen(false);
    setEditingCoupon(null);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (!eligibleUsers || eligibleUsers.length === 0) return;
    if (!selectAll) {
      setSelectedUsers(eligibleUsers.map((u) => u._id));
      setSelectAll(true);
    } else {
      setSelectedUsers([]);
      setSelectAll(false);
    }
  };

  const handleSendCoupons = async () => {
    if (!editingCoupon || selectedUsers.length === 0) return;
    try {
      await dispatch(
                sendCouponsToUsers({
          couponCode: editingCoupon.code, // Changed from couponId to couponCode
          userIds: selectedUsers
        })
      ).unwrap();
      toast({ title: "Coupons sent successfully" });
      closeSend();
    } catch {
      // handled by error effect
    }
  };

  // ------ Filters -------
  const buildQueryFilters = () => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (filterType !== "all") filters.type = filterType;
    if (filterCustomerType !== "all") filters.customerType = filterCustomerType;
    return filters;
  };

  const applyFilters = () => {
    dispatch(fetchAllCoupons(buildQueryFilters()));
  };

  // Value label
  const valueLabel = useMemo(
    () => (formData.type === "percentage" ? "Percentage (%)" : "Amount (KES)"),
    [formData.type]
  );

  // Badges
  const getStatusBadge = (coupon) => {
    const now = new Date();
    const isExpired = new Date(coupon.validUntil) < now;
    const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

    if (!coupon.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (isExpired) return <Badge variant="destructive">Expired</Badge>;
    if (isUsedUp) return <Badge variant="outline">Used Up</Badge>;
    return <Badge className="bg-green-600">Active</Badge>;
  };

  const getCustomerTypeBadge = (type) => {
    const badges = {
      top_buyer: <Badge className="bg-purple-600">Top Buyer</Badge>,
      subscriber: <Badge className="bg-blue-600">Subscriber</Badge>,
      new_customer: <Badge className="bg-green-600">New Customer</Badge>,
      general: <Badge variant="outline">General</Badge>
    };
    return badges[type] || <Badge variant="outline">Unknown</Badge>;
  };

  return (
    <PageWrapper message="Loading coupons...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Coupon Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and send discount coupons to your customers
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
              {/* Open send from row action; keeping trigger here for accessibility */}
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Send Coupon to Users</DialogTitle>
                </DialogHeader>

                {!editingCoupon ? (
                  <p className="text-muted-foreground">Select a coupon to send.</p>
                ) : (
                  <div className="space-y-5">
                    {/* Chosen coupon summary */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Selected Coupon</div>
                            <div className="font-semibold">
                              {editingCoupon.name}{" "}
                              <span className="font-mono text-xs ml-2 opacity-80">
                                {editingCoupon.code}
                              </span>
                            </div>
                            <div className="text-sm">
                              {editingCoupon.type === "percentage"
                                ? `${editingCoupon.value}%`
                                : `KES ${editingCoupon.value}`}
                            </div>
                          </div>
                          <div>{getStatusBadge(editingCoupon)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Eligible users list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Eligible Users</div>
                        <div className="flex items-center gap-3">
                          <Label
                            htmlFor="select-all"
                            className="text-sm text-muted-foreground"
                          >
                            Select all
                          </Label>
                          <Switch
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={toggleSelectAll}
                            disabled={fetchingEligibleUsers || !eligibleUsers?.length}
                          />
                        </div>
                      </div>

                      {fetchingEligibleUsers ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                      ) : eligibleUsers && eligibleUsers.length > 0 ? (
                        <div className="max-h-72 overflow-y-auto border rounded-md">
                          {eligibleUsers.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50"
                            >
                              <input
                                type="checkbox"
                                className="rounded border"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => toggleUser(user._id)}
                                id={`user-${user._id}`}
                              />
                              <label htmlFor={`user-${user._id}`} className="flex-1">
                                {user.name || user.email}{" "}
                                {user.name ? `(${user.email})` : ""}
                              </label>
                              <div>{getCustomerTypeBadge(user.customerType)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No eligible users found.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={closeSend}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSendCoupons}
                        disabled={
                          sendingCoupons ||
                          !eligibleUsers?.length ||
                          selectedUsers.length === 0
                        }
                      >
                        {sendingCoupons
                          ? "Sending..."
                          : `Send to ${selectedUsers.length} user${
                              selectedUsers.length === 1 ? "" : "s"
                            }`}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateEditOpen} onOpenChange={setIsCreateEditOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={openCreate}>
                  <Plus className="w-4 h-4" />
                  Create Coupon
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Coupon Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                        }
                        placeholder="SAVE20"
                        required
                        disabled={!!editingCoupon}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Coupon Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="20% Off Sale"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, description: e.target.value }))
                      }
                      placeholder="Special discount for valued customers"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Discount Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((p) => ({ ...p, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="value">{valueLabel} *</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))}
                        placeholder={formData.type === "percentage" ? "20" : "500"}
                        required
                        min="0"
                        max={formData.type === "percentage" ? "100" : undefined}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerType">Customer Type *</Label>
                      <Select
                        value={formData.customerType}
                        onValueChange={(value) =>
                          setFormData((p) => ({ ...p, customerType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="top_buyer">Top Buyer</SelectItem>
                          <SelectItem value="subscriber">Subscriber</SelectItem>
                          <SelectItem value="new_customer">New Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="usageLimit">Usage Limit</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, usageLimit: e.target.value }))
                        }
                        placeholder="Leave empty for unlimited"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="perUserLimit">Per User Limit *</Label>
                      <Input
                        id="perUserLimit"
                        type="number"
                        value={formData.perUserLimit}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, perUserLimit: e.target.value }))
                        }
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimumOrderAmount">Minimum Order (KES)</Label>
                      <Input
                        id="minimumOrderAmount"
                        type="number"
                        value={formData.minimumOrderAmount}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, minimumOrderAmount: e.target.value }))
                        }
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="validFrom">Valid From *</Label>
                      <Input
                        id="validFrom"
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, validFrom: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Valid Until *</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, validUntil: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="autoAssign"
                      checked={formData.autoAssign}
                      onCheckedChange={(checked) =>
                        setFormData((p) => ({ ...p, autoAssign: checked }))
                      }
                    />
                    <Label htmlFor="autoAssign">Auto-assign to eligible customers</Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={closeCreateEdit}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={creatingCoupon || updatingCoupon}>
                      {creatingCoupon || updatingCoupon
                        ? "Saving..."
                        : editingCoupon
                        ? "Update"
                        : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        {couponStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Coupons</p>
                    <p className="text-2xl font-bold">{couponStats.overview?.totalCoupons || 0}</p>
                  </div>
                  <Gift className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Coupons</p>
                    <p className="text-2xl font-bold">{couponStats.overview?.activeCoupons || 0}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Usage</p>
                    <p className="text-2xl font-bold">{couponStats.overview?.totalUsage || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Discount</p>
                    <p className="text-2xl font-bold">
                      {couponStats.overview?.averageDiscount?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <Percent className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[220px]">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by code, name, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="filterType">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filterCustomerType">Customer Type</Label>
                <Select value={filterCustomerType} onValueChange={setFilterCustomerType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="top_buyer">Top Buyer</SelectItem>
                    <SelectItem value="subscriber">Subscriber</SelectItem>
                    <SelectItem value="new_customer">New Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              All Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Customer Type</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {couponList?.length ? (
                    couponList.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                        <TableCell>{coupon.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 capitalize">
                            {coupon.type === "percentage" ? (
                              <Percent className="w-4 h-4" />
                            ) : (
                              <DollarSign className="w-4 h-4" />
                            )}
                            {coupon.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          {coupon.type === "percentage"
                            ? `${coupon.value}%`
                            : `KES ${coupon.value}`}
                        </TableCell>
                        <TableCell>{getCustomerTypeBadge(coupon.customerType)}</TableCell>
                        <TableCell>
                          {coupon.usedCount} / {coupon.usageLimit || "∞"}
                        </TableCell>
                        <TableCell>
                          {coupon.validUntil
                            ? new Date(coupon.validUntil).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(coupon)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openSend(coupon)}
                              title="Send coupon to users"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(coupon)}
                              title="Edit coupon"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(coupon._id)}
                              disabled={deletingCoupon}
                              title="Delete coupon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No coupons found. Create your first coupon to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default AdminCoupons;
