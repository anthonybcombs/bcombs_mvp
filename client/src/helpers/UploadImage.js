import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Files from "react-butterfiles";
import styled, { ThemeContext } from "styled-components";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./images";
import CustomCropper from "./CustomCropper";
import cloneDeep from 'lodash.clonedeep'

const UploadImageStyled = styled.div`
  text-align: center;
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

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_FILE_SIZE = 5000000;

export default function UploadImage({ displayImage = "", handleImageChange, getImgObject }) {
  const [imageView, setImageView] = useState(
    displayImage.length > 0 ? displayImage : ""
  );
  const [errors, setErrors] = useState([]);
  const [cropper, setCropper] = useState(false);

  useEffect(() => {
    if(displayImage) {
      setImageView(displayImage);
    }
  },[displayImage])

  return (
    <UploadImageStyled>
      <Files
        multiple={false}
        maxSize="5mb"
        multipleMaxSize="10mb"
        convertToBase64
        accept={["image/jpg", "image/jpeg", "image/png"]}
        onSuccess={files => {
          if (files[0] && files[0].size < ALLOWED_FILE_SIZE) {
            setImageView(files[0]);
            setErrors([]);
            setCropper(true);
          }
        }}
        onError={errors => setErrors(errors)}>
        {({ browseFiles }) => {
          return (
            <>
              {cropper ? (
                <div>
                  <CroppedImage
                    imageFile={imageView}
                    imageBase64={imageView.src.base64}
                    onCancel={() => {
                      setImageView(displayImage);
                      setCropper(false);
                    }}
                    onSave={image => {
                      if (getImgObject) {
                        const newImage = cloneDeep(imageView)
                        newImage.src.base64 = image
                        getImgObject(newImage)
                      }
                      setImageView(image);
                      setCropper(false);
                      handleImageChange(image);
                    }}
                  />
                </div>
              ) : (
                <>
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
                          backgroundColor: "lightblue",
                          objectFit: "contain"
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
                  </div>
                  {errors.map((error, key) => (
                    <p className="error" key={key}>
                      {error.file.name} - {error.type}
                    </p>
                  ))}
                  <br />
                  <p>File type supported is jpeg, jpg, png.</p>
                  <p>File size supported is maximum 5MB</p>
                </>
              )}
            </>
          );
        }}
      </Files>
    </UploadImageStyled>
  );
}

const CropperImageStyled = styled.div`
  backround-color: white;
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
const CroppedImage = ({ imageFile, imageBase64, onCancel, onSave }) => {
  const [cropImage, setCropImage] = useState("");

  const cropend = (value) => {
    setCropImage(value);
  };

  return (
    <CropperImageStyled>
      <CustomCropper image={imageBase64} cropend={cropend} />
      <div
        style={{
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

              if (ALLOWED_FILE_TYPES.includes(imageFile.type)) {
                onSave(cropImage);
              }
            }}>
            Crop
          </button>
        </div>
      </div>
    </CropperImageStyled>
  );
};
