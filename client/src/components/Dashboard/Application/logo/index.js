import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Files from "react-butterfiles";
import { useDispatch } from "react-redux";

import { requestUpdateVendor, requestUpdateVendorLogo} from "../../../../redux/actions/Vendors";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import Loading from "../../../../helpers/Loading.js";
import UploadImage from "../../../../helpers/UploadImage";


import { s3BucketRootPath } from '../../../../constants/aws';

import Toggle from "react-toggle";
import "react-toggle/style.css";

const ApplicationSettingsStyled = styled.div`
  .application-form-settings {
    padding: 1.2em 1em;
  }

  .application-form-settings {
    font-size: 1.2em;
  }

  #applicationForm form > div {
    margin-bottom: 20px;
  }

  #applicationForm .form-group textarea.form-control {
    resize: none;
    padding: 0;
  }

  #applicationForm .form-group {
    position: relative;
  }

  #applicationForm .form-group .react-toggle {
    position: absolute;
    right: 0;
    bottom: 12px;
  }

  #applicationForm .field-input.title {
    width: 92%;
  }

  .textarea-container {
    background-color: #f1f1f1;
    padding: 10px;
    line-height: 1.6;
  }

  .formsettings-btn-container {
    margin-top: 40px;
    text-align: right;
    margin: 0 !important;
  }

  .formsettings-btn-container button {
    color: #555555;
    cursor: default;
    border: 0;
    border-bottom-color: transparent;
    -webkit-text-decoration: none;
    text-decoration: none;
    cursor: pointer;
    background: #f26e21;
    color: white;
    border-radius: 25px;
    padding: 12px 25px;
    display: inline-block;
    font-size: 16px;
  }

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

  // .buttons-control {
  //   display: grid;
  //   grid-template-columns: 50% 50%;
  //   grid-gap: 1%;
  // }
  button.save {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
  }
`;

export default function index({ vendor, formSettingsLoading = false }) {
    const [formSettings, setFormSettings] = useState({
        name: vendor && vendor.name ? vendor.name : "",
        section1_text: vendor && vendor.section1_text ? vendor.section1_text : "",
        section2_text: vendor && vendor.section2_text ? vendor.section2_text : "",
        section3_text: vendor && vendor.section3_text ? vendor.section3_text : "",
        section1_name: vendor && vendor.section1_name ? vendor.section1_name : "",
        section2_name: vendor && vendor.section2_name ? vendor.section2_name : "",
        section3_name: vendor && vendor.section3_name ? vendor.section3_name : "",
        section1_show: vendor && vendor.section1_show,
        section2_show: vendor && vendor.section2_show,
        section3_show: vendor && vendor.section3_show
    });

    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
      if(vendor && vendor.logo) {
        setImagePreview(`${s3BucketRootPath}/${vendor?.logo}`);
      }
    },[vendor]);



    const { register, handleSubmit, errors } = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange"
    });

    const handleFormSettingsChange = (id, value) => {
        console.log(id, value);

        setFormSettings({ ...formSettings, [id]: value });
    };

    const dispatch = useDispatch();

    const handleFileChange = image => {
        setImagePreview(image);
    };
  

    const onSubmit = () => {
  
        try {
        
          // onSubmit(imagePreview);
          dispatch(requestUpdateVendorLogo({
            vendor_id: vendor?.id,
            logo: imagePreview
          }))
          } catch (e) {
            console.error(e);
          }
    };
    return (
        <ApplicationSettingsStyled>
            <div id="applicationForm" className="application-form-settings">
                {formSettingsLoading ? (
                    <Loading />
                ) : (
                    <div style={{ maxWidth: 500 }}>
                        <UploadImage
                            displayImage={imagePreview}
                            handleImageChange={handleFileChange}
                        />

                        <div id="buttons-control">
                        
                            <button onClick={onSubmit} className="save" type="submit">
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ApplicationSettingsStyled>
    );
}
