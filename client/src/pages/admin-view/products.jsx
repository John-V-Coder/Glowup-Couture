"use client";

import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Fragment, useState, useEffect, useMemo } from "react";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  getProductStats,
  getLowStockProducts,
  clearProductErrors,
} from "@/store/admin/products-slice";
import PageWrapper from "@/components/common/page-wrapper";

const initialFormData = {
  image: null,
  images: [],
  title: "",
  description: "",
  category: "",
  material: "",
  size: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  status: true, // Changed to boolean
  featured: false,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    productList,
    pagination,
    productStats,
    lowStockData,
    fetchingProductsLoading,
    addingProductLoading,
    editingProductLoading,
    deletingProductLoading,
    fetchingLowStockLoading,
    fetchingStatsLoading,
    addProductError,
    editProductError,
    deleteProductError,
    fetchProductsError,
    getLowStockProductsError,
    getProductStatsError,
  } = useSelector((state) => state.adminProducts);

  const displayProducts = useMemo(() => {
    return showLowStock ? lowStockData.lowStockProducts : productList;
  }, [showLowStock, productList, lowStockData.lowStockProducts]);

  useEffect(() => {
    if (addProductError || editProductError || deleteProductError || fetchProductsError || getLowStockProductsError || getProductStatsError) {
      toast({
        title: "An error occurred",
        description: addProductError || editProductError || deleteProductError || fetchProductsError || getLowStockProductsError || getProductStatsError,
        variant: "destructive",
      });
      dispatch(clearProductErrors());
    }
  }, [addProductError, editProductError, deleteProductError, fetchProductsError, getLowStockProductsError, getProductStatsError, toast, dispatch]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image: uploadedImages[0] || null,
      images: uploadedImages,
    }));
  }, [uploadedImages]);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getProductStats());
  }, [dispatch]);

  const handleCloseDialog = () => {
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setUploadedImages([]);
    setImagesLoading(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    
    // Prepare data for API (convert to backend format if needed)
    const apiData = {
      ...formData,
      // If backend expects string status instead of boolean:
      // status: formData.status ? 'active' : 'inactive',
      // featured: formData.featured ? 'yes' : 'no',
    };

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData: apiData }))
        .unwrap()
        .then(() => {
          toast({ title: "Product updated successfully" });
          handleCloseDialog();
        });
    } else {
      dispatch(addNewProduct(apiData))
        .unwrap()
        .then(() => {
          toast({ title: "Product added successfully" });
          handleCloseDialog();
        });
    }
  };

  const handleDelete = (getCurrentProductId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(getCurrentProductId))
        .unwrap()
        .then(() => {
          toast({ title: "Product deleted successfully" });
        });
    }
  };

  const handleShowLowStock = () => {
    setShowLowStock(!showLowStock);
    if (!showLowStock) {
      dispatch(getLowStockProducts());
    }
  };

  function isFormValid() {
    const requiredFields = ["image", "title", "description", "category", "price", "totalStock"];
    return requiredFields.every((field) => {
      const value = formData[field];
      
      // Boolean fields are always valid
      if (field === "status" || field === "featured") {
        return true;
      }
      
      return value !== null && value !== undefined && value !== "";
    });
  }

  useEffect(() => {
    if (currentEditedId !== null) {
      const productToEdit = productList.find((p) => p._id === currentEditedId);
      if (productToEdit) {
        const combinedImages = [...new Set([productToEdit.image, ...(Array.isArray(productToEdit.images) ? productToEdit.images : [])].filter(Boolean))];
        setUploadedImages(combinedImages);
        
        // Convert status to boolean if it comes as string from API
        const formattedProduct = {
          ...productToEdit,
          status: typeof productToEdit.status === 'string' 
            ? productToEdit.status === 'active' 
            : Boolean(productToEdit.status),
          featured: Boolean(productToEdit.featured)
        };
        
        setFormData(formattedProduct);
      }
    }
  }, [currentEditedId, productList]);

  const isActionLoading = addingProductLoading || editingProductLoading || deletingProductLoading || fetchingProductsLoading || fetchingLowStockLoading;

  return (
    <PageWrapper loading={isActionLoading} message="Loading products...">
      <Fragment>
        <div className="mb-5 w-full flex justify-between items-center flex-wrap gap-2">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <h1 className="text-2xl font-bold">Products</h1>
            {productStats && (
              <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
                <span>Total: {productStats.overview.totalProducts}</span>
                <span>Active: {productStats.overview.activeProducts}</span>
                <span>Low Stock: {productStats.overview.lowStockProducts}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={showLowStock ? "default" : "outline"}
              onClick={handleShowLowStock}
              disabled={fetchingLowStockLoading}
            >
              {showLowStock ? "Show All" : "Low Stock"}
            </Button>
            <Button onClick={() => setOpenCreateProductsDialog(true)}>
              Add New Product
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts && displayProducts.length > 0 ? (
            displayProducts.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              {showLowStock ? "No low stock products found" : "No products found"}
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && !showLowStock && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalProducts} total products)
          </div>
        )}

        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={handleCloseDialog}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
              <SheetDescription>
                {currentEditedId !== null ? "Edit the product details below." : "Fill out the form to add a new product to your store."}
              </SheetDescription>
            </SheetHeader>
            <ProductImageUpload
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              imagesLoading={imagesLoading}
              setImagesLoading={setImagesLoading}
              isEditMode={currentEditedId !== null}
            />
            <div className="py-6">
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedId !== null ? "Update" : "Add"}
                formControls={addProductFormElements}
                isBtnDisabled={!isFormValid() || addingProductLoading || editingProductLoading}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>
    </PageWrapper>
  );
}

export default AdminProducts;