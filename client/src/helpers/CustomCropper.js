import React, { useCallback, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CustomCropper = props => {
  const {
    cropend,
    image = "https://live.staticflickr.com/2912/13981352255_fc59cfdba2_b.jpg"
  } = props;
  const cropper = useRef(null);

  const onCropChange = useCallback(() => {
    cropend(cropper.current.getCroppedCanvas().toDataURL("image/jpeg"));
  }, []);

  const onCrop = () => {
    cropend(cropper.current.getCroppedCanvas().toDataURL("image/jpeg"));
  };
  return (
    <Cropper
      ref={cropper}
      src={image}
      style={{ height: 400, width: "100%" }}
      // Cropper.js options
      aspectRatio={4 / 3}
      guides={false}
      crop={onCrop}
      cropend={onCropChange}
      viewMode={3}
    />
  );
};

export default CustomCropper;
