import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment, useState, useEffect } from "react";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
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
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  
  
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Sync uploaded images to formData (first image is main image)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      image: uploadedImages[0] || null,
      images: uploadedImages,
    }));
  }, [uploadedImages]);

  
  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setUploadedImages([]);
        }
      });
    } else {
      dispatch(addNewProduct(formData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setUploadedImages([]);
          setFormData(initialFormData);
          toast({
            title: "Product added successfully",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    // Required fields (salePrice is optional)
    const requiredFields = ["image", "title", "description", "category", "material", "size", "price", "totalStock"];
    
    return requiredFields.every((field) => {
      const value = formData[field];
      return value !== null && value !== undefined && value !== "";
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // When editing, set formData and uploaded image URL accordingly
  useEffect(() => {
    if (currentEditedId !== null) {
      const productToEdit = productList.find((p) => p._id === currentEditedId);
      if (productToEdit) {
        setFormData(productToEdit);
        const existingImages = Array.isArray(productToEdit.images) && productToEdit.images.length
          ? productToEdit.images
          : (productToEdit.image ? [productToEdit.image] : []);
        setUploadedImages(existingImages);
      }
    }
  }, [currentEditedId, productList]);

  return (
    <PageWrapper message="Loading products...">
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImages([]);
          setImagesLoading(false);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
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
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
    </PageWrapper>
  );
}

export default AdminProducts;
