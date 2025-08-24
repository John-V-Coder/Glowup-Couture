import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Package, 
  TrendingUp, 
  Star, 
  AlertTriangle, 
  XCircle, 
  DollarSign,
  BarChart3,
  Tag,
  Award,
  RefreshCw,
  TrendingDown,
  Activity,
  ShoppingCart,
  Database,
  Target,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import your actual Redux actions - adjust the path as needed
import { getProductStats } from '@/store/admin/products-slice';

const ProductStatsAdmin = () => {
  const dispatch = useDispatch();
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    coreMetrics: true,
    financial: true,
    stockHealth: true,
    categories: true,
    brands: true
  });

  // Derive 'allExpanded' from the state, don't store it separately
  const allExpanded = Object.values(expandedSections).every(Boolean);
  
  // Get data from your actual Redux store
  const {
    productStats,
    fetchingStatsLoading,
    getProductStatsError
  } = useSelector((state) => ({
    productStats: state.adminProducts.productStats,
    fetchingStatsLoading: state.adminProducts.fetchingStatsLoading,
    getProductStatsError: state.adminProducts.getProductStatsError
  }));

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleAllSections = () => {
    const newState = !allExpanded;
    setExpandedSections({
      coreMetrics: newState,
      financial: newState,
      stockHealth: newState,
      categories: newState,
      brands: newState
    });
  };

  useEffect(() => {
    dispatch(getProductStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getProductStats());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const getStockStatus = (lowStock, outOfStock, total) => {
    if (total === 0) return { status: 'good', color: 'default' };
    const criticalStock = (lowStock || 0) + (outOfStock || 0);
    const percentage = (criticalStock / total) * 100;
    
    if (percentage > 20) return { status: 'critical', color: 'destructive' };
    if (percentage > 10) return { status: 'warning', color: 'warning' };
    return { status: 'good', color: 'default' };
  };

  if (fetchingStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <RefreshCw className="w-12 h-12 animate-spin text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Loading Analytics</CardTitle>
            <CardDescription>Fetching your product statistics...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (getProductStatsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8">
            <Alert variant="destructive" className="mb-6">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Statistics</AlertTitle>
              <AlertDescription className="mt-2">
                {typeof getProductStatsError === 'string' ? getProductStatsError : 'Failed to load product analytics'}
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={handleRefresh} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use optional chaining for safe access
  const { overview, categories, topBrands, threshold } = productStats || {};

  // Additional check for overview object
  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No Data Available</CardTitle>
            <CardDescription>Product statistics are not available at the moment.</CardDescription>
            <Button onClick={handleRefresh} className="mt-4 gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stockHealth = getStockStatus(overview?.lowStockProducts, overview?.outOfStockProducts, overview?.totalProducts);
  const activeRate = overview?.totalProducts > 0 ? (overview?.activeProducts / overview?.totalProducts) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Product Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive overview of your inventory and performance metrics
            </p>
          </div>
          <div className="flex gap-2 self-start">
            <Button onClick={toggleAllSections} variant="outline" className="gap-2">
              {allExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>
        
        <Collapsible open={expandedSections.coreMetrics} onOpenChange={() => toggleSection('coreMetrics')}>
          <Card className="w-full">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Database className="h-6 w-6 text-primary" />
                      Core Product Metrics
                    </CardTitle>
                    <CardDescription className="text-base">
                      Essential statistics about your product inventory
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden md:flex">
                      {overview?.totalProducts ? formatNumber(overview.totalProducts) : 0} products
                    </Badge>
                    {expandedSections.coreMetrics ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Total Products */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-muted-foreground">Total Products</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{formatNumber(overview?.totalProducts)}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatNumber(overview?.activeProducts)} active
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({activeRate.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={activeRate} className="h-2" />
                    </div>
                  </div>

                  {/* Featured Products */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-muted-foreground">Featured Products</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{formatNumber(overview?.featuredProducts)}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {overview?.totalProducts > 0 ? (((overview?.featuredProducts || 0) / overview.totalProducts) * 100).toFixed(1) : 0}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">of inventory</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Products */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-muted-foreground">Active Products</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-green-600">{formatNumber(overview?.activeProducts)}</div>
                      <div className="text-xs text-muted-foreground">
                        Ready for sale
                      </div>
                    </div>
                  </div>

                  {/* Inactive Products */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-muted-foreground">Inactive Products</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-gray-600">
                        {formatNumber((overview?.totalProducts || 0) - (overview?.activeProducts || 0))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Not available for sale
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Sheet 2: Financial Overview */}
        <Collapsible open={expandedSections.financial} onOpenChange={() => toggleSection('financial')}>
          <Card className="w-full">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <DollarSign className="h-6 w-6 text-primary" />
                      Financial Overview
                    </CardTitle>
                    <CardDescription className="text-base">
                      Inventory value and pricing analytics
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden md:flex">
                      {overview?.totalStockValue ? formatCurrency(overview.totalStockValue) : '$0'}
                    </Badge>
                    {expandedSections.financial ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Total Stock Value */}
                  <div className="space-y-4 p-6 bg-green-50/50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-6 w-6 text-green-600" />
                        <span className="font-medium text-green-800">Total Stock Value</span>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        Portfolio
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-green-700">
                        {formatCurrency(overview?.totalStockValue)}
                      </div>
                      <div className="text-sm text-green-600">
                        Total inventory investment value
                      </div>
                    </div>
                  </div>

                  {/* Average Product Price */}
                  <div className="space-y-4 p-6 bg-blue-50/50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                        <span className="font-medium text-blue-800">Average Product Price</span>
                      </div>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        Pricing
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-blue-700">
                        {formatCurrency(overview?.averagePrice)}
                      </div>
                      <div className="text-sm text-blue-600">
                        Mean price across all products
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Sheet 3: Stock Health & Alerts */}
        <Collapsible open={expandedSections.stockHealth} onOpenChange={() => toggleSection('stockHealth')}>
          <Card className="w-full">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Activity className="h-6 w-6 text-primary" />
                      Stock Health & Alerts
                    </CardTitle>
                    <CardDescription className="text-base">
                      Inventory levels and stock management alerts
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockHealth.color} className="hidden md:flex capitalize">
                      {stockHealth.status}
                    </Badge>
                    {expandedSections.stockHealth ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Low Stock Alert */}
                  <div className="space-y-4 p-6 bg-orange-50/50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                        <span className="font-medium text-orange-800">Low Stock</span>
                      </div>
                      <Badge variant="outline" className="text-orange-700 border-orange-300">
                        ≤ {threshold} units
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="text-4xl font-bold text-orange-600">
                        {formatNumber(overview?.lowStockProducts)}
                      </div>
                      <div className="text-sm text-orange-600">
                        Products need restocking soon
                      </div>
                      <Progress 
                        value={overview?.totalProducts > 0 ? ((overview?.lowStockProducts || 0) / overview.totalProducts) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Out of Stock */}
                  <div className="space-y-4 p-6 bg-red-50/50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-6 w-6 text-red-600" />
                        <span className="font-medium text-red-800">Out of Stock</span>
                      </div>
                      <Badge variant="destructive">
                        Critical
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="text-4xl font-bold text-red-600">
                        {formatNumber(overview?.outOfStockProducts)}
                      </div>
                      <div className="text-sm text-red-600">
                        Products unavailable for sale
                      </div>
                      <Progress 
                        value={overview?.totalProducts > 0 ? ((overview?.outOfStockProducts || 0) / overview.totalProducts) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Stock Health Summary */}
                  <div className="space-y-4 p-6 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Healthy Stock</span>
                      </div>
                      <Badge variant="outline" className="text-emerald-700 border-emerald-300 capitalize">
                        {stockHealth.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="text-4xl font-bold text-emerald-600">
                        {formatNumber((overview?.totalProducts || 0) - (overview?.lowStockProducts || 0) - (overview?.outOfStockProducts || 0))}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Products with adequate stock
                      </div>
                      <Progress 
                        value={overview?.totalProducts > 0 ? (((overview?.totalProducts || 0) - (overview?.lowStockProducts || 0) - (overview?.outOfStockProducts || 0)) / overview.totalProducts) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Sheet 4: Category Analytics */}
        <Collapsible open={expandedSections.categories} onOpenChange={() => toggleSection('categories')}>
          <Card className="w-full">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Tag className="h-6 w-6 text-primary" />
                      Category Analytics
                    </CardTitle>
                    <CardDescription className="text-base">
                      Product distribution and performance by category
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden md:flex">
                      {categories?.length || 0} categories
                    </Badge>
                    {expandedSections.categories ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-6">
                  {categories?.map((category, index) => (
                    <div key={category?._id} className="p-6 bg-muted/30 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-primary" />
                          <h3 className="text-xl font-semibold">{category?._id}</h3>
                          <Badge variant="secondary" className="ml-2">
                            Category #{index + 1}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {formatNumber(category?.count)}
                          </div>
                          <div className="text-sm text-muted-foreground">Products</div>
                        </div>
                        
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {formatNumber(category?.totalStock)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Stock</div>
                        </div>
                        
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {formatCurrency(category?.averagePrice)}
                          </div>
                          <div className="text-sm text-muted-foreground">Average Price</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Sheet 5: Top Brands Performance */}
        <Collapsible open={expandedSections.brands} onOpenChange={() => toggleSection('brands')}>
          <Card className="w-full">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Award className="h-6 w-6 text-primary" />
                      Top Brands Performance
                    </CardTitle>
                    <CardDescription className="text-base">
                      Leading brands by product count and inventory levels
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden md:flex">
                      Top {topBrands?.length || 0} brands
                    </Badge>
                    {expandedSections.brands ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  {topBrands?.map((brand, index) => (
                    <div key={brand?._id} className="p-6 bg-muted/30 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{brand?._id}</h3>
                            <p className="text-sm text-muted-foreground">Brand Performance</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {formatNumber(brand?.count)}
                            </div>
                            <div className="text-sm text-muted-foreground">Products</div>
                          </div>
                          
                          <div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {formatNumber(brand?.totalStock)}
                            </div>
                            <div className="text-sm text-muted-foreground">Stock Units</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Footer Information Sheet */}
        <Card className="w-full bg-muted/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Configuration & Settings</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Low stock threshold: ≤ {threshold || 'N/A'} units</p>
                  <p>• Data refreshed automatically on page load</p>
                  <p>• All financial values displayed in USD</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductStatsAdmin;