import React, { useCallback, useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import UploadImage from "../../../../helpers/UploadImage";

import { getCroppedImg } from "../../../../helpers/images";

const UploadPhotoModal = styled.div`
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
    margin: 1em auto;
    width: 20%;
  }
  .modal-content .modal-body >div >div {
    margin: 0 !important;
    cursor: pointer !important;
    min-height: unset !important;
    max-height: 300px !important;
    border: 2px dashed #ddd !important;
    transition: .5s ease-in-out;
  }
  .modal-content .modal-body >div >div >img {
    object-fit: cover !important;
    transition: .5s ease-in-out;
  }

  .modal-content .modal-body >div >div:hover {
    border: 2px dashed #ec6e33 !important;
  }
  .modal-content .modal-body >div >div:hover img {
    opacity: .8;
  }
  @media screen and (max-width: 1920px) {
    .modal-content {
      margin: 1.5em auto;
      width: 35%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px;
    }
    button[type="submit"] {
      width: 30%;
    }
  }
  @media screen and (max-width: 1024px) {
    .modal-content {
      margin: 1.5em auto;
      width: 50%;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      margin: 1.5em auto;
      width: 62%;
    }
  }
  #buttons-control {
    text-align: center;
    margin-top: 2em;
  }
  div[class$="multiValue"] div {
    background-color: #f26e21;
    color: white;
  }
  @media screen and (max-width: 1920px) {
    #buttons-control button {
      width: 20%;
      display: inline-block;
      margin: 1em;
    }
  }
  @media screen and (max-width: 1024px) {
    #buttons-control button {
      width: 20%;
      display: inline-block;
      margin: 1em;
    }
  }
  @media screen and (max-width: 768px) {
    #buttons-control button {
      width: 100%;
      display: inline-block;
      margin: .5rem 0;
    }
  }
  @media (min-width: 600px) {
    input {
      width: 100%;
      margin: 0 auto;
    }
    #family-list {
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    }
    #family-list div {
      grid-template-columns: 10% 90%;
      text-align: left;
      padding: 1em;
    }
    #family-list > div > p > span {
      position: absolute;
      display: inline-block;
      top: 6px;
    }
    #buttons-control button {
      display: inline-block;
      margin: 1em;
      width: 120px;
    }
  }
`;
const isURL = str => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
};

export default function index({
  isVisible = true,
  auth,
  onSubmit,
  toggleProfilePhotoVisible,
  getImgObject = null
}) {
  const theme = useContext(ThemeContext);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (auth) {
      setImagePreview(auth.profile_img || auth.picture);
    }
  }, []);

  useEffect(() => {
    if (isVisible && auth) {
      setImagePreview(auth.profile_img || auth.picture);
    }
  }, [auth, isVisible]);

  const handleFileChange = image => {
    setImagePreview(image);
  };

  const showCroppedImage = () => {
    try {
      if (!isURL(imagePreview) && imagePreview) {
        onSubmit(imagePreview);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <UploadPhotoModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <div className="modal-body">
          <UploadImage
            displayImage={imagePreview}
            handleImageChange={handleFileChange}
            getImgObject={getImgObject}
          />

          <div id="buttons-control">
            <button
              data-testid="app-big-calendar-new-cancel-button"
              type="button"
              onClick={() => toggleProfilePhotoVisible(false)}>
              Cancel
            </button>
            <button
              className="save-image"
              data-testid="app-big-calendar-new-save-button"
              onClick={showCroppedImage}
              type="submit">
              Save
            </button>
          </div>
        </div>
      </div>
    </UploadPhotoModal>,
    document.getElementById("modal")
  );
}
