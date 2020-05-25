import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { requestUpdateVendor } from "../../../../redux/actions/Vendors";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import Loading from "../../../../helpers/Loading.js";

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
`;

export default function index({
  vendor,
  formSettingsLoading = false
}) {

  const [formSettings, setFormSettings] = useState({
    name: vendor.name ? vendor.name : "",
    section1_text: vendor.section1_text ? vendor.section1_text : "",
    section2_text: vendor.section2_text ? vendor.section2_text : "",
    section3_text: vendor.section3_text ? vendor.section3_text : "",
    section1_name: vendor.section1_name ? vendor.section1_name : "",
    section2_name: vendor.section2_name ? vendor.section2_name : "",
    section3_name: vendor.section3_name ? vendor.section3_name : "",
    section1_show: vendor.section1_show,
    section2_show: vendor.section2_show,
    section3_show: vendor.section3_show,
  });

  console.log("formSettings");
  console.log(formSettings);

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const handleFormSettingsChange = (id, value) => {

    console.log(id, value);

    setFormSettings({...formSettings, [id]: value});
  }

  const dispatch = useDispatch();

  const onSubmit = () => {
    const payload = {
      id: vendor.id,
      name: formSettings.name,
      user: vendor.user,
      section1_text: formSettings.section1_text,
      section2_text: formSettings.section2_text,
      section3_text: formSettings.section3_text,
      section1_name: formSettings.section1_name,
      section2_name: formSettings.section2_name,
      section3_name: formSettings.section3_name,
      section1_show: formSettings.section1_show ? 1 : 0,
      section2_show: formSettings.section2_show ? 1 : 0,
      section3_show: formSettings.section3_show ? 1 : 0
    };

    dispatch(requestUpdateVendor(payload));
  }

  return (
    <ApplicationSettingsStyled>
      <div id="applicationForm" className="application-form-settings">
        {
          formSettingsLoading ? (
            <Loading />
          ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="form-group">
                <div className="field">
                  <input 
                    name="vendor_name" 
                    className="field-input" 
                    placeholder="Vendor Name"
                    onChange={({target}) => handleFormSettingsChange("name", target.value)}
                    defaultValue={formSettings.name}
                  />
                  <label className="field-label">Vendor Name</label>
                </div>
              </div>
            </div>
            <div>
              <div className="form-group">
                <div className="field">
                  <input 
                    name="section1_title" 
                    className="field-input title" 
                    placeholder="Title"
                    onChange={({target}) => handleFormSettingsChange("section1_name", target.value)}
                    defaultValue={formSettings.section1_name}
                  />
                  <label className="field-label">Title</label>
                </div>
                <Toggle 
                  defaultChecked={!!+formSettings.section1_show} 
                  icons={false} 
                  onChange={({target}) => handleFormSettingsChange("section1_show", target.checked)}  
                />
              </div>
            </div>
            <div>
              <div className="form-group">
                <div className="textarea-container">
                  <textarea 
                    name="waiver_text"
                    className="form-control"
                    placeholder="Context"
                    rows="15"
                    onChange={({target}) => handleFormSettingsChange("section1_text", target.value)}
                    defaultValue={formSettings.section1_text}
                  >
                  </textarea>
                </div>
              </div>
            </div>
            <div>
              <div className="form-group">
                <div className="field">
                  <input 
                    name="section1_title" 
                    className="field-input title" 
                    placeholder="Title"
                    onChange={({target}) => handleFormSettingsChange("section2_name", target.value)}
                    defaultValue={formSettings.section2_name}
                  />
                  <label className="field-label">Title</label>
                </div>
                <Toggle 
                  defaultChecked={!!+formSettings.section2_show} 
                  icons={false}
                  onChange={({target}) => handleFormSettingsChange("section2_show", target.checked)}
                />
              </div>
            </div>
            <div>
              <div className="form-group">
                <div className="textarea-container">
                  <textarea 
                    name="liability_waiver_text"
                    className="form-control"
                    rows="15"
                    onChange={({target}) => handleFormSettingsChange("section2_text", target.value)}
                    defaultValue={formSettings.section2_text}
                  >
                  </textarea>
                </div>
              </div>
            </div>
            <div>
              <div className="form-group">
                <div className="field">
                  <input 
                    name="section1_title" 
                    className="field-input title" 
                    placeholder="Title"
                    onChange={({target}) => handleFormSettingsChange("section3_name", target.value)}
                    defaultValue={formSettings.section3_name}
                  />
                  <label className="field-label">Title</label>
                </div>
                <Toggle 
                  defaultChecked={!!+formSettings.section3_show} 
                  icons={false} 
                  onChange={({target}) => handleFormSettingsChange("section3_show", target.checked)}
                />
              </div>
            </div>
            <div>
              <div className="form-group">
                <div className="textarea-container">
                  <textarea 
                    name="terms_and_conditions_text"
                    className="form-control"
                    rows="15"
                    onChange={({target}) => handleFormSettingsChange("terms_and_conditions_text", target.value)}
                    defaultValue={formSettings.section3_text}
                  >
                  </textarea>
                </div>
              </div>
            </div>
            <div className="formsettings-btn-container">
              <button type="submit">Save</button>
            </div>
          </form>
          )
        }
       
      </div>
    </ApplicationSettingsStyled>
  )
}