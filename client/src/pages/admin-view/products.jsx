import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment, useState, useEffect } from "react";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdditionalImagesUpload from "@/components/admin-view/additional-images-upload";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

const initialFormData = {
  image: null,
  images: [], // Additional images for product gallery
  title: "",
  description: "",
  category: "",
  material: "",
  color: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  
  // Additional images state
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagesLoading, setAdditionalImagesLoading] = useState(false);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Sync uploaded image URL into formData.image automatically
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  // Sync additional images into formData.images automatically
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      images: additionalImages,
    }));
  }, [additionalImages]);

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
          setImageFile(null);
          setUploadedImageUrl("");
          setAdditionalImages([]);
          setAdditionalImageFiles([]);
        }
      });
    } else {
      dispatch(addNewProduct(formData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setUploadedImageUrl("");
          setFormData(initialFormData);
          setAdditionalImages([]);
          setAdditionalImageFiles([]);
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
    const requiredFields = ["image", "title", "description", "category", "material", "color", "price", "totalStock"];
    
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
        setUploadedImageUrl(productToEdit.image || "");
        setImageFile(null);
        // Load existing additional images for editing
        setAdditionalImages(productToEdit.images || []);
      }
    }
  }, [currentEditedId, productList]);

  return (
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
          setUploadedImageUrl("");
          setImageFile(null);
          setImageLoadingState(false);
          setAdditionalImages([]);
          setAdditionalImageFiles([]);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <AdditionalImagesUpload
            additionalImages={additionalImages}
            setAdditionalImages={setAdditionalImages}
            additionalImagesLoading={additionalImagesLoading}
            setAdditionalImagesLoading={setAdditionalImagesLoading}
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
  );
}

export default AdminProducts;
