import React, { useCallback, useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

import Cropper from "react-easy-crop";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import { getCroppedImg } from "../../../../helpers/images";

const UploadPhotoModal = styled.form`
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
    height: 35px;
  }
  .save-image {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    display: block;

    width: 20%;
    border: none;
  }
  .modal-content {
    width: 70%;
    height: 80%;
    display: flex;
    flex-direction: column;
    min-height: 500px !important;
  }
  .crop-container {
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    bottom: 80px;
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input,
    p.error {
      width: 70%;
      margin: 2.5em auto 2.5em auto;
    }
    div {
      width: 70%;
      margin: 0 auto 2.5em auto;
    }
  }
`;

export default function index({ isVisible = true, auth, onSubmit }) {
  const theme = useContext(ThemeContext);
  const { handleSubmit, errors } = useForm();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isVisible && auth) {
      setImagePreview(auth.profile_img);
    }
  }, [auth, isVisible]);

  const handleFileChange = (event) => {
    console.log("event.target.files", event.target.files);

    let reader = new FileReader();

    reader.onloadend = () => {
      console.log("setImagePreview", reader.result);
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      console.log("croppedArea", croppedAreaPixels);
      const croppedImage = await getCroppedImg(
        imagePreview,
        croppedAreaPixels,
        rotation
      );

      onSubmit(croppedImage.file);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
    setImagePreview("");
    toggleProfilePhotoVisible(false);
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <UploadPhotoModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="modal-content">
        <div className="crop-container">
          <Cropper
            cropShape={"round"}
            image={imagePreview}
            crop={crop}
            zoom={zoom}
            aspect={4 / 4}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: {
                height: "80%",
                minHeight: 500,
              },
            }}
          />
          <div
            style={{
              display: "flex",
              bottom: 15,
              left: 200,
              position: "absolute",
            }}
          >
            <input type="file" name="file" onChange={handleFileChange} />

            <button
              className="save-image"
              data-testid="app-profile-submit-button"
              onClick={showCroppedImage}
            >
              Save
            </button>
            <button
              className="save-image"
              data-testid="app-profile-submit-button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </UploadPhotoModal>,
    document.getElementById("modal")
  );
}
