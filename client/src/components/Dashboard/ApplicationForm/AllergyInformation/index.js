import React from "react";
import styled from "styled-components";
const GeneralInformationFormStyled = styled.div`
  position: relative; 
  margin-top:12px;

  .general-info-wrapper {
    padding-bottom: 30px !important;
  }

  

  .general-info-wrapper .grid-1 {
    display: grid;
    grid-template-columns: 31% 31% 31%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-2 {
    display: grid;
    grid-template-columns: 48.33% 48.33%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-3 {
    display: grid;
    grid-template-columns: 31% 65.3%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-4 {
    display: grid;
    grid-template-columns: 31% 21% 41%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-5 {
    display: grid;
    grid-template-columns: 19.2% 19.2% 19.2% 19.2%;
    grid-gap: 8%;
  }

  @media (max-width: 940px) {
    .general-info-wrapper .grid,
    .general-info-wrapper .grid-5,
    .general-info-wrapper .grid-4,
    .general-info-wrapper .grid-3,
    .general-info-wrapper .grid-2,
    .general-info-wrapper .grid-1 {
      grid-gap: 0;
      grid-template-columns: 100%;
    }
    #multiselectContainerReact {
      position: relative;
      top: 0;
    }
   .field-input:placeholder-shown + .field-label {
      max-width: calc(100% - 30%) !important;
    }
  }
  
  @media (max-width: 600px) {
    .general-info-wrapper .grid,
    .general-info-wrapper .grid-5,
    .general-info-wrapper .grid-4,
    .general-info-wrapper .grid-3,
    .general-info-wrapper .grid-2,
    .general-info-wrapper .grid-1 {
      padding: 0;
    }
    .general-info-wrapper>div {
      padding: 0;
    }
  }
  .radio-highlights{
    background: #f26e21 !important ;
  }

`;

export default function index({
    childGeneralInformation,
    handleChildFormDetailsChange,
    counter,

    isReadonly = false,
    pastChildInformation = {},
    isVendorView,
    printPageClassname
}) {




    return (
        <GeneralInformationFormStyled className={printPageClassname}>
            <h3 className="heading">Allergy Information</h3>
            {/* BUSINESS INFO */}
            <div className="general-info-wrapper">


              
                <div className="grid">
                <label className="field-label-simple" style={{ padding: 4 }}>  
                    Please complete this information and list any known allergies.  This will allow us to safely engage with students during meetings, outings and other experiences when they are under our supervision.
                </label>
                    <div className="form-group">
                        <div className="field">
                            <input
                                name="ch_allergies_to_medicine"
                                // className="field-input"
                                className={
                                    isReadonly &&
                                        !isVendorView &&
                                        pastChildInformation &&
                                        (pastChildInformation.allergies_to_medicine || pastChildInformation.allergies_to_medicine == "") &&
                                        pastChildInformation.allergies_to_medicine != childGeneralInformation.allergies_to_medicine ?
                                        "field-input highlights" : "field-input"
                                }
                                placeholder="Allergies to Medicine"
                                id={`ch_allergies_to_medicine_${counter - 1}`}
                                onChange={({ target }) => {
                                    handleChildFormDetailsChange(counter - 1, "general_information", "allergies_to_medicine", target.value);
                                }}
                                readOnly={isReadonly}
                                defaultValue={childGeneralInformation.allergies_to_medicine}
                            />

                            <label className="field-label" for={`ch_allergies_to_medicine_${counter - 1}`}>Allergies to Medicine</label>
                        </div>
                    </div>
                </div>

                <div className="grid">
                    <div className="form-group">
                        <div className="field">
                            <input
                                name="ch_food_allergies"
                                // className="field-input"
                                className={
                                    isReadonly &&
                                        !isVendorView &&
                                        pastChildInformation &&
                                        (pastChildInformation.food_allergies || pastChildInformation.food_allergies == "") &&
                                        pastChildInformation.food_allergies != childGeneralInformation.food_allergies ?
                                        "field-input highlights" : "field-input"
                                }
                                placeholder="Food Allergies"
                                id={`ch_food_allergies_${counter - 1}`}
                                onChange={({ target }) => {
                                    handleChildFormDetailsChange(counter - 1, "general_information", "food_allergies", target.value);
                                }}
                                readOnly={isReadonly}
                                defaultValue={childGeneralInformation.food_allergies}
                            />
                            <label className="field-label" for={`ch_food_allergies_${counter - 1}`}>Food Allergies</label>
                        </div>
                    </div>
                </div>


                <div className="grid">
                    <div className="form-group">
                        <div className="field">
                            <input
                                name="ch_insect_allergies"
                                // className="field-input"
                                className={
                                    isReadonly &&
                                        !isVendorView &&
                                        pastChildInformation &&
                                        (pastChildInformation.insect_allergies || pastChildInformation.insect_allergies == "") &&
                                        pastChildInformation.insect_allergies != childGeneralInformation.insect_allergies ?
                                        "field-input highlights" : "field-input"
                                }
                                placeholder="Insect Allergies"
                                id={`ch_insect_allergies_${counter - 1}`}
                                onChange={({ target }) => {
                                    handleChildFormDetailsChange(counter - 1, "general_information", "insect_allergies", target.value);
                                }}
                                readOnly={isReadonly}
                                defaultValue={childGeneralInformation.insect_allergies}
                            />
                            <label className="field-label" for={`ch_insect_allergies_${counter - 1}`}>Insect Allergies</label>
                        </div>
                    </div>
                </div>

                <div className="grid">
                    <div className="form-group">
                        <div className="field">
                            <input
                                name="ch_other_allergies"
                                // className="field-input"
                                className={
                                    isReadonly &&
                                        !isVendorView &&
                                        pastChildInformation &&
                                        (pastChildInformation.other_allergies || pastChildInformation.other_allergies == "") &&
                                        pastChildInformation.other_allergies != childGeneralInformation.other_allergies ?
                                        "field-input highlights" : "field-input"
                                }
                                placeholder="Other Allergies"
                                id={`ch_other_allergies_${counter - 1}`}
                                onChange={({ target }) => {
                                    handleChildFormDetailsChange(counter - 1, "general_information", "other_allergies", target.value);
                                }}
                                readOnly={isReadonly}
                                defaultValue={childGeneralInformation.other_allergies}
                            />
                            <label className="field-label" for={`ch_other_allergies_${counter - 1}`}>Other Allergies</label>
                        </div>
                    </div>
                </div>



                <div className="grid">
                    <div className="form-group">
                        <div className="field">
                            <input
                                name="ch_current_medications"
                                // className="field-input"
                                className={
                                    isReadonly &&
                                        !isVendorView &&
                                        pastChildInformation &&
                                        (pastChildInformation.current_medications || pastChildInformation.current_medications == "") &&
                                        pastChildInformation.current_medications != childGeneralInformation.current_medications ?
                                        "field-input highlights" : "field-input"
                                }
                                placeholder="Current Medications"
                                id={`ch_current_medications_${counter - 1}`}
                                onChange={({ target }) => {
                                    handleChildFormDetailsChange(counter - 1, "general_information", "current_medications", target.value);
                                }}
                                readOnly={isReadonly}
                                defaultValue={childGeneralInformation.current_medications}
                            />
                            <label className="field-label" for={`ch_current_medications_${counter - 1}`}>Current Medication</label>
                        </div>
                    </div>
                </div>

                <div className="grid">
                    <div className="form-group">
                        <div className="field">
                            <input
                                name="health_insurance_information"
                                // className="field-input"
                                className={
                                    isReadonly &&
                                        !isVendorView &&
                                        pastChildInformation &&
                                        (pastChildInformation.health_insurance_information || pastChildInformation.health_insurance_information == "") &&
                                        pastChildInformation.health_insurance_informationhealth_insurance_information != childGeneralInformation.health_insurance_information ?
                                        "field-input highlights" : "field-input"
                                }
                                placeholder="Health Insurance Information (Policy Name, Policy #, Policy Holder's Name)"
                                id={`ch_health_insurance_information_${counter - 1}`}
                                onChange={({ target }) => {
                                    handleChildFormDetailsChange(counter - 1, "general_information", "health_insurance_information", target.value);
                                }}
                                readOnly={isReadonly}
                                defaultValue={childGeneralInformation.health_insurance_information}
                            />
                            <label className="field-label" for={`ch_health_insurance_information_${counter - 1}`}>Health Insurance Information (Policy NName, Policy #, Policy Holder's Name)</label>
                        </div>
                    </div>
                </div>
            </div>


        </GeneralInformationFormStyled>
    )
}