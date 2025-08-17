import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";

function AdminDashboard() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  function handleUploadFeatureImage() {
    const url = uploadedImages[0];
    if (!url) return;
    dispatch(addFeatureImage(url)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setUploadedImages([]);
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        imagesLoading={imagesLoading}
        setImagesLoading={setImagesLoading}
        isEditMode={false}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} disabled={imagesLoading || uploadedImages.length === 0} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-6 mt-5">
  {featureImageList && featureImageList.length > 0
    ? featureImageList.map((featureImgItem) => (
        <div
          key={featureImgItem._id || featureImgItem.image}
          className="relative w-full mx-auto bg-gray-50 rounded-lg shadow-md p-4"
        >
          <img
            src={featureImgItem.image}
            alt="Featured"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
              maxHeight: "none",
            }}
            className="rounded-lg"
          />
        </div>
      ))
    : null}
</div>


    </div>
  );
}

export default AdminDashboard;
