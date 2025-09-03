import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, Edit, Trash2, Percent, DollarSign, Users, Gift, 
  TrendingUp, Calendar, Target, Zap, BarChart3 
} from "lucide-react";
import {
  createCoupon,
  fetchAllCoupons,
  updateCoupon,
  deleteCoupon,
  autoAssignCoupons,
  getCouponStats,
  clearErrors
} from "@/store/admin/coupon-slice";
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
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: "",
  autoAssign: false,
  applicableCategories: [],
  excludedCategories: []
};

function AdminCoupons() {
  const [formData, setFormData] = useState(initialFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCustomerType, setFilterCustomerType] = useState("all");

  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    couponList,
    couponStats,
    pagination,
    isLoading,
    creatingCoupon,
    updatingCoupon,
    deletingCoupon,
    autoAssigning,
    fetchingStats,
    createError,
    updateError,
    deleteError,
    autoAssignError,
    error
  } = useSelector((state) => state.adminCoupons);

  useEffect(() => {
    dispatch(fetchAllCoupons());
    dispatch(getCouponStats());
  }, [dispatch]);

  useEffect(() => {
    if (createError || updateError || deleteError || autoAssignError || error) {
      toast({
        title: "Error",
        description: createError || updateError || deleteError || autoAssignError || error,
        variant: "destructive"
      });
      dispatch(clearErrors());
    }
  }, [createError, updateError, deleteError, autoAssignError, error, toast, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      value: parseFloat(formData.value),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      perUserLimit: parseInt(formData.perUserLimit),
      minimumOrderAmount: parseFloat(formData.minimumOrderAmount)
    };

    try {
      if (editingCoupon) {
        await dispatch(updateCoupon({ id: editingCoupon._id, couponData })).unwrap();
        toast({ title: "Coupon updated successfully" });
      } else {
        await dispatch(createCoupon(couponData)).unwrap();
        toast({ title: "Coupon created successfully" });
      }
      
      handleCloseDialog();
      dispatch(fetchAllCoupons());
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      ...coupon,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit?.toString() || "",
      perUserLimit: coupon.perUserLimit?.toString() || "1",
      minimumOrderAmount: coupon.minimumOrderAmount?.toString() || "0",
      value: coupon.value?.toString() || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await dispatch(deleteCoupon(id)).unwrap();
        toast({ title: "Coupon deleted successfully" });
        dispatch(fetchAllCoupons());
      } catch (error) {
        // Error handled by useEffect
      }
    }
  };

  const handleAutoAssign = async () => {
    try {
      const result = await dispatch(autoAssignCoupons()).unwrap();
      toast({ 
        title: "Coupons auto-assigned successfully",
        description: `Top buyer: ${result.data.results.topBuyer}, Subscribers: ${result.data.results.subscribers}, New customers: ${result.data.results.newCustomers}`
      });
      dispatch(fetchAllCoupons());
      dispatch(getCouponStats());
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormData);
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const isExpired = new Date(coupon.validUntil) < now;
    const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

    if (!coupon.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isUsedUp) {
      return <Badge variant="outline">Used Up</Badge>;
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Coupon Management</h1>
            <p className="text-muted-foreground">Create and manage discount coupons for your customers</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAutoAssign}
              disabled={autoAssigning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {autoAssigning ? "Auto-assigning..." : "Auto-assign Coupons"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Coupon
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Coupon Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SAVE20"
                        required
                        disabled={editingCoupon} // Don't allow editing code
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Coupon Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Special discount for valued customers"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">Discount Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
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
                      <Label htmlFor="value">
                        {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (KES)'} *
                      </Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder={formData.type === 'percentage' ? '20' : '500'}
                        required
                        min="0"
                        max={formData.type === 'percentage' ? '100' : undefined}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerType">Customer Type *</Label>
                      <Select value={formData.customerType} onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}>
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
                        onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, perUserLimit: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumOrderAmount: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Valid Until *</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoAssign"
                      checked={formData.autoAssign}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoAssign: checked }))}
                    />
                    <Label htmlFor="autoAssign">Auto-assign to eligible customers</Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={creatingCoupon || updatingCoupon}>
                      {creatingCoupon || updatingCoupon ? "Saving..." : editingCoupon ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        {couponStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Coupons</p>
                    <p className="text-2xl font-bold">{couponStats.overview.totalCoupons || 0}</p>
                  </div>
                  <Gift className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Coupons</p>
                    <p className="text-2xl font-bold">{couponStats.overview.activeCoupons || 0}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                    <p className="text-2xl font-bold">{couponStats.overview.totalUsage || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Discount</p>
                    <p className="text-2xl font-bold">{couponStats.overview.averageDiscount?.toFixed(1) || 0}%</p>
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
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search">Search Coupons</Label>
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
                  <SelectTrigger className="w-[150px]">
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
                  <SelectTrigger className="w-[150px]">
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
              <Button
                onClick={() => {
                  const filters = {};
                  if (searchTerm) filters.search = searchTerm;
                  if (filterType !== "all") filters.type = filterType;
                  if (filterCustomerType !== "all") filters.customerType = filterCustomerType;
                  dispatch(fetchAllCoupons(filters));
                }}
                variant="outline"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coupons Table */}
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {couponList.length > 0 ? (
                    couponList.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                        <TableCell>{coupon.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {coupon.type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                            {coupon.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `KES ${coupon.value}`}
                        </TableCell>
                        <TableCell>{getCustomerTypeBadge(coupon.customerType)}</TableCell>
                        <TableCell>
                          {coupon.usedCount} / {coupon.usageLimit || '∞'}
                        </TableCell>
                        <TableCell>{new Date(coupon.validUntil).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(coupon)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(coupon)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(coupon._id)}
                              disabled={deletingCoupon}
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