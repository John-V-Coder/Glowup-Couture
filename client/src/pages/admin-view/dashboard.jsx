import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
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
