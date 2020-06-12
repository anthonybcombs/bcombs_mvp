import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import Files from "react-butterfiles";
import styled, { ThemeContext } from "styled-components";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./images";
const UploadImageStyled = styled.div`
  button {
    display: block;
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    box-shadow: 0px 3px 6px #908e8e;
    padding: 10px;
    margin: 10px auto;
    border: none;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
    width: 100%;
  }
`;
export default function UploadImage({ displayImage = "", handleImageChange }) {
  const [imageView, setImageView] = useState(
    displayImage.length > 0 ? displayImage : ""
  );
  const [errors, setErrors] = useState([]);
  const [cropper, setCropper] = useState(false);
  return (
    <UploadImageStyled>
      <Files
        multiple={false}
        maxSize="2mb"
        multipleMaxSize="10mb"
        convertToBase64
        accept={["application/pdf", "image/jpg", "image/jpeg"]}
        onSuccess={files => {
          setImageView(files[0]);
          setErrors([]);
          setCropper(true);
        }}
        onError={errors => setErrors(errors)}>
        {({ browseFiles }) => (
          <>
            {cropper ? (
              <div>
                {ReactDOM.createPortal(
                  <CroppedImage
                    image={imageView.src.base64}
                    onCancel={() => {
                      setCropper(false);
                    }}
                    onSave={image => {
                      let reader = new FileReader();
                      reader.onloadend = () => {
                        setImageView(reader.result);
                        handleImageChange(reader.result);
                      };
                      reader.readAsDataURL(image);
                      setCropper(false);
                    }}
                  />,
                  document.getElementById("uploadImage")
                )}
              </div>
            ) : (
              <div
                onClick={e => {
                  e.preventDefault();
                  browseFiles();
                }}
                style={{
                  border: `1px dashed grey`,
                  minHeight: 300,
                  maxHeight: 300,
                  margin: 10,
                  cursor: "pointer"
                }}>
                {imageView.length > 0 ? (
                  <img
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      backgroundColor: "lightblue"
                    }}
                    src={imageView}
                  />
                ) : (
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5em",
                      lineHeight: 13
                    }}>
                    Select image on file to upload
                  </div>
                )}
                {errors.map((error, key) => (
                  <p className="error" key={key}>
                    {error.file.name} - {error.type}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </Files>
    </UploadImageStyled>
  );
}

const CropperImageStyled = styled.div`
  button {
    display: block;
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    box-shadow: 0px 3px 6px #908e8e;
    padding: 10px;
    margin: 10px auto;
    border: none;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
    width: 100%;
  }
  .cropper-control {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 1%;
  }
  button.save {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
  }
`;
const CroppedImage = ({ image, onCancel, onSave }) => {
  const [crop, onCropChange] = React.useState({ x: 0, y: 0 });
  const [zoom, onZoomChange] = React.useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  return (
    <CropperImageStyled>
      <Cropper
        style={{
          containerStyle: {
            zIndex: 2000,
            height: "100vh",
            position: "fixed"
          }
        }}
        image={image}
        crop={crop}
        zoom={zoom}
        onRotationChange={setRotation}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
      />
      <div
        style={{
          position: "fixed",
          bottom: -10,
          right: 0,
          width: 200,
          zIndex: 2200,
          margin: 10
        }}>
        <div className="cropper-control">
          <button
            style={{ width: "100%", boxShadow: "none" }}
            onClick={e => {
              e.preventDefault();
              onCancel();
            }}>
            Cancel
          </button>
          <button
            className="save"
            style={{ width: "100%", boxShadow: "none" }}
            onClick={async e => {
              e.preventDefault();
              const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
              );
              onSave(croppedImage.file);
            }}>
            Save
          </button>
        </div>
      </div>
    </CropperImageStyled>
  );
};
