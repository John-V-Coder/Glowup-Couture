import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { SquarePen, Trash2, Power, Loader2 } from "lucide-react";
import { updateProductStock, deleteProduct, toggleProductStatus } from "@/store/admin/products-slice";
import { useState } from "react";

function AdminProductTile({
  product,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setFormData,
}) {
  const dispatch = useDispatch();
  const [localLoading, setLocalLoading] = useState({
    toggle: false,
    delete: false
  });

  // Get loading states from Redux store with fallback values
  const {
    deletingProductLoading = false,
    togglingStatusLoading = false,
    updatingStockLoading = false,
  } = useSelector((state) => state.adminProducts || {});

  const handleDelete = async (id) => {
    if (id) {
      setLocalLoading(prev => ({ ...prev, delete: true }));
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setLocalLoading(prev => ({ ...prev, delete: false }));
      }
    }
  };

  const handleToggleStatus = async (id) => {
    if (id) {
      setLocalLoading(prev => ({ ...prev, toggle: true }));
      try {
        await dispatch(toggleProductStatus(id)).unwrap();
        // The Redux store will update the product status automatically
      } catch (error) {
        console.error("Failed to toggle product status:", error);
        // Optionally show an error message to the user
      } finally {
        setLocalLoading(prev => ({ ...prev, toggle: false }));
      }
    }
  };

  const handleEdit = (product) => {
    if (product && setOpenCreateProductsDialog && setCurrentEditedId && setFormData) {
      setOpenCreateProductsDialog(true);
      setCurrentEditedId(product._id);
      setFormData(product);
    }
  };

  // Determine if any action is in progress for this specific product
  const isToggleLoading = localLoading.toggle;
  const isDeleteLoading = localLoading.delete;
  const isAnyActionLoading = isToggleLoading || isDeleteLoading;

  // Return null if product is not available
  if (!product) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative">
        <img
          src={product.image || "/placeholder-image.jpg"}
          alt={product.title || "Product"}
          className="w-full h-[280px] object-cover rounded-t-lg"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
            product.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{product.title || "Untitled Product"}</h2>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
            } text-lg font-semibold`}
          >
            ${product.price || 0}
          </span>
          {product.salePrice > 0 && (
            <span className="text-lg font-bold text-red-600">${product.salePrice}</span>
          )}
        </div>
        <p className={`text-sm font-medium ${(product.totalStock || 0) <= 5 ? "text-red-500" : "text-green-500"}`}>
          Stock: {product.totalStock || 0}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 p-4">
        {/* Active/Deactive button on top */}
        <Button
          onClick={() => handleToggleStatus(product._id)}
          disabled={isAnyActionLoading}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium"
          variant={product.isActive ? "destructive" : "default"}
          size="sm"
        >
          {isToggleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Power size={16} />
          )}
          <span>
            {isToggleLoading ? "Processing..." : product.isActive ? "Deactivate" : "Activate"}
          </span>
        </Button>
        
        {/* Edit and Delete buttons below */}
        <div className="flex space-x-2 w-full">
          <Button
            onClick={() => handleEdit(product)}
            disabled={isAnyActionLoading}
            className="flex-1 flex items-center justify-center space-x-1 py-2 text-sm font-medium"
            size="sm"
          >
            <SquarePen size={16} />
            <span>Edit</span>
          </Button>
          <Button
            onClick={() => handleDelete(product._id)}
            disabled={isAnyActionLoading}
            variant="destructive"
            className="flex-1 flex items-center justify-center space-x-1 py-2 text-sm font-medium"
            size="sm"
          >
            {isDeleteLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            <span>{isDeleteLoading ? "Deleting..." : "Delete"}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;