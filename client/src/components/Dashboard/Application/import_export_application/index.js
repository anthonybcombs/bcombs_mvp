import React, { useEffect, useState } from 'react';
import { CSVLink, CSVDownload } from "react-csv";
import styled from "styled-components";
import { format } from 'date-fns';
import { isValidJSONString } from '../../../../helpers/Arrays';

function removeCarriageReturn(inputString = '') {
    return inputString.replace(/\r/g, '');
}

function formatDate(inputDate = '') {
    // Use toISOString to get the date in ISO format and then substring to extract the date portion
    return inputDate.substring(0, 10);
}

function isValidDate(dateString) {
    // Check if the given string can be successfully converted to a Date object
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
}


function parseValues(str = '') {
    str = str.replace(/"/g, '')
    return str.replace(/^"(.*)"$/, '$1').replace(/\\/g, '');
}

function convertToQuotedString(inputString) {
    return '"' + inputString + '"';
}
  
const importCustomForm = async (data, formType) => {

    // Default options are marked with *
    const response = await fetch(`${process.env.API_HOST}/api/application/import?type=${formType}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            data
        })
    });
    return response.json();
}


const reOrderColumns = (array) => {
    const indexOfUniqueId = array.indexOf('Unique ID');
  
    if (indexOfUniqueId !== -1) {
      // Remove 'unique_id' from its original position
      array.splice(indexOfUniqueId, 1);
      
      // Insert 'unique_id' at index 2
      array.splice(2, 0, 'Unique ID');
    }
  
    return array;
  }

const parentFields = {
    firstname: 'Parent Firstname',
    lastname: 'Parent Lastname',
    phone_type: 'Parent Phone Type',
    phone_number: 'Parent Phone Number',
    email_type: 'Parent Email Type',
    email_address: 'Parent Email Address',
    password: 'Parent Password',
    occupation: 'Occupation',
    employers_name: 'Employers Name',
    parent_goals: 'Parent Goals',
    parent_child_goals: 'Parent Child Goals',
    level_of_education: 'Parent Level of Education',
    child_hs_grad: 'Parent Child HS Grad',
    child_col_grad: 'Parent Child College Grad',
    address: 'Parent Address',
    city: 'Parent City',
    state: 'Parent State',
    zip_code: 'Parent Zip Code',
    person_recommend: 'Person Recommend',
    birthdate: 'Parent Birthdate',
    gender: 'Parent Gender',
    age: 'Parent Age',
    // create_profile: 'Create Profile'
}

// const instructorFields = {

//     firstname: 'Instructor Firstname',
//     lastname: 'Instructor Lastname',
//     // create_profile: 'Create Profile'
// }


// const customFormParentField = {
//     'Parent Title': 'title',
//     'Parent First Name': 'first name',
//     'Parent Middle Name': 'middle name',
//     'Parent Last Name': 'last name'
// }

const childFields = {
    application_id: 'Application ID',
    ch_id: 'Child ID',
    new_childId: 'UniqueID',
    firstname: 'Child Firstname',
    lastname: 'Child Lastname',
    nickname: 'Child Nickname',
    age: 'Child Age',
    birthdate: 'Child Birthdate',
    gender: 'Child Gender',
    phone_type: 'Child Phone Type',
    phone_number: 'Child Phone Number',
    email_type: 'Child Email Type',
    email_address: 'Child Email Address',
    password: 'Child Password',
    address: 'Child Address',
    city: 'Child City',
    state: 'Child State',
    zip_code: 'Child Zip Code',
    location_site: 'Location Site',
    school_name: 'School Name',
    school_phone: 'School Phone',
    has_suspended: 'Has Suspended',
    reason_suspended: 'Reason Suspended',
    year_taken: 'Year Taken',
    hobbies: 'Hobbies',
    life_events: 'Life Events',
    career_goals: 'Career Goals',
    colleges: 'Colleges',
    affiliations: 'Affiliations',
    awards: 'Awards',
    accomplishments: 'Accomplishments',
    mentee_gain_program: 'Mentee Gain Program',
    grade_number: 'Grade Number',
    grade_desc: 'Grade Desc',
    class_rank: 'Class Rank',
    gpa_quarter_year: 'GPA Quarter Year',
    gpa_quarter_q1: 'GPA Quarter 1',
    gpa_quarter_q2: 'GPA Quarter 2',
    gpa_quarter_q3: 'GPA Quarter 3',
    gpa_quarter_q4: 'GPA Quarter 4',
    gpa_cumulative_year: 'GPA Cumulative Year',
    gpa_cumulative_q1: 'GPA Cumulative Quarter 1',
    gpa_cumulative_q2: 'GPA Cumulative Quarter 2',
    gpa_cumulative_q3: 'GPA Cumulative Quarter 3',
    gpa_cumulative_q4: 'GPA Cumulative Quarter 4',
    // ethnicities: getAppEtnicities(childsInformation[i].profile.ethinicity),
    // programs: getAppPrograms(childsInformation[i].profile.program),
    doctor_name: 'Doctor Name',
    doctor_phone: 'Doctor Phone',
    hospital_preference: 'Doctor Hospital Preference',
    hospital_phone: 'Hospital Phone',

    // include_in_directory: childsInformation[i].general_information.include_in_directory,
    // business_name: childsInformation[i].general_information.business_name,
    // business_website: childsInformation[i].general_information.business_website,
    // business_phone: childsInformation[i].general_information.business_phone,
    // business_email: childsInformation[i].general_information.business_email,
    // business_industry: childsInformation[i].general_information.business_industry,
    // business_address: childsInformation[i].general_information.business_address,
    // business_description: childsInformation[i].general_information.business_description,
    // employment_status: childsInformation[i].general_information.employment_status,
    // allergies_to_medicine: childsInformation[i].general_information.allergies_to_medicine,
    // food_allergies: childsInformation[i].general_information.food_allergies,
    // insect_allergies: childsInformation[i].general_information.insect_allergies,
    // other_allergies: childsInformation[i].general_information.other_allergies,
    // current_medications: childsInformation[i].general_information.current_medications,
    // health_insurance_information: childsInformation[i].general_information.health_insurance_information,
}





const ImportExportApplicationModal = styled.div`
  .modal {
    padding: 0;
  }

  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 500px;
    padding: 0;
  }

  .modal-header {
    padding: 1em;
    background-color: #f26e21;
    color: #fff;
  }

  .modal-container {
    background-color: #fff;
    padding: 20px 25px;
  }

  .modal-container p {
    margin-top: 0;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    color: #fff;
  }`;


//      max-width: 200px;
const ImportExportApplicationStyled = styled.div`
    padding-bottom: 12px !important;

    #uploadButton, #exportButton {
        background-color: #f26e21;
        padding: 10px 32px;
        width: 100%;
        display: block;
        color: white;
        border-radius: 5px;

        margin: 0 10px;
        text-decoration: none;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: pre;
    }

    #uploadButton,
    #exportButton {
      font-size: 1em;
      color: #fff;
      background-color: #f26e21;
      border-radius: 4px;
      padding: 10px 15px;
      border: 0;
    }
  
`;

const ImportExportApplication = props => {
    const { vendor, form, formType = 'mentoring', isLot = false, createProfileFeature = false, selectedApplications = [], refreshData } = props;

    const [columns, setColumns] = useState([]);
    const [content, setContent] = useState(null);

    const [existingData, setExistingData] = useState([]);

    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [currentFormPayload, setCurrentFormPayload] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreateProfile, setIsCreateProfile] = useState(false);
    const [exportWithData, setExportWithData] = useState(false);
    const [isImportSuccess, setIsImportSuccess] = useState(false);
    const applicationName = `${formType === 'custom' && !isLot ? form?.form_contents?.formTitle || 'Custom Form' : isLot ? 'LOT Form' : 'Mentoring Application'}`;

    console.log('selectedApplications',selectedApplications)
    let currentFormData = form?.form_contents?.formData ? form?.form_contents?.formData.map(item => {
        let fields = item.fields;
        if (
            item.type === 'multipleChoice' ||
            item.type === 'dropDown' ||
            item.type === 'paragraphText' ||
            item.type === 'singleLineText' ||
            item.type === 'ranking'
        ) {
            fields = fields.map(item2 => {
                return {
                    ...item2,
                    label: item.label || item2.label
                }
            })
        }

        return {
            ...item,
            fields
        }
    }) : []


    useEffect(() => {
        return () => {
            setCurrentFormPayload(null);
            setIsImportSuccess(false);
        }
    }, [isModalVisible])

    useEffect(() => {

        if (formType === 'custom' && form?.form_contents?.formData) {

            const currentFormContents = form?.form_contents?.formData.reduce((accum, item, index) => {

                if (item.type !== 'terms') {
                    let fields = [];
                    const title = item.label.toLowerCase();
                    if (title === 'parent' || title === 'instructor') {
                        fields = item.fields.map(item2 => `${item.label} ${item2.label}`)
                    }
                    else {
                        fields = item.type === 'date' ||
                            item.type === 'dropDown' ||
                            item.type === 'paragraphText' ||
                            item.type === 'singleLineText' ||
                            item.type === 'ranking' ? [item?.label] : item.fields.map(item2 =>
                                (item2.type === 'multipleChoice') ? item.label : item2.label || '')
                    }
                    return {
                        ...accum,
                        [index]: {
                            id: item.id,
                            title: item.label,
                            fields: fields
                        }
                    }
                }

                return {
                    ...accum
                }
            }, {});
         


            let currentColumns = Object.keys(currentFormContents).map((key) => {
                return currentFormContents[key].fields
            }, []).flat().filter(field => field);

            let defaultColumns = ['Application ID', 'Child ID']
            if (!currentColumns.includes('Unique ID')) {
                defaultColumns = [...defaultColumns, 'Unique ID']
            }
            else if(currentColumns.includes('Unique ID')) {
                currentColumns = [...defaultColumns, ...currentColumns];
                currentColumns = reOrderColumns(currentColumns)
            }
            else {
                currentColumns = [...defaultColumns, ...currentColumns];
            }
  
            setColumns(currentColumns);
            setContent(currentFormContents);
        }
        else if (formType === 'mentoring') {
            const childColumns = Object.keys(childFields).map((key) => {
                return childFields[key]
            }, []).flat();

            const parentColumns = Object.keys(parentFields).map((key) => {
                return parentFields[key]
            }, []).flat();


            let totalColumns = [...childColumns, ...parentColumns];
            //  totalColumns = createProfileFeature ? [...totalColumns, 'Create Profile'] : totalColumns;


            setColumns([...totalColumns]);

        }
    }, [form, formType]);

    const handleUpload = (file) => {
        if (!file) {
            return;
        }


        let reader = new FileReader()
        reader.onloadend = function (e) {

            const rows = e.target.result.split("\n");
            if (rows.length > 0) {


                //setImportData(rows);

                const formattedRows = rows.map(row => row.split(','))
                const importedColumns = formattedRows[0]; // columns
                let importedData = formattedRows.slice(1); // data from csv
                importedData = importedData.filter(item => {
                    return !item.every(val => !val)
                })

                console.log('formattedRows', formattedRows)
                console.log('formattedRows importedColumns', importedColumns)
                console.log('formattedRows importedData', importedData)
                // CUSTOM FORM IMPORT DATA //
                if (formType === 'custom') {
                    let formattedImportData = importedData.map((data, index) => {
                        const item = data.reduce((accum, data2, index2) => {
                            const currentKey = removeCarriageReturn(importedColumns[index2]);

                            if (accum.hasOwnProperty(currentKey)) {
                                return {
                                    ...accum,
                                    [`${currentKey} 2`]: data2
                                }
                            }
                            return {
                                ...accum,
                                [currentKey]: data2
                            }
                        }, {});

                        return {
                            ...item
                        }

                    });


    
                    const getCurrentData = (data, field) => {
                        return Object.keys(data).find(key => key && key.includes(field.label))
                    }

                    const formWithValues = formattedImportData.map(item => {
                        const existingApplication = selectedApplications.find(app => item['Child ID'] && (app?.child?.ch_id === item['Child ID']));
                        console.log('existingApplication',existingApplication)
                        const formContentWithValues = currentFormData.map(formData => {

                      
                            let parentKey = null;

                            if (formData.type === 'date') {
                                parentKey = getCurrentData(item, formData);
                            }

                            const updatedFields = formData.fields.map(field => {

                                if (!['formattedText', 'staticImage', 'pageBreak'].includes(field.tag) && !['terms'].includes(field.type)) {
                                    const currentData = getCurrentData(item, field);
                                    console.log('currentData', currentData)
                                    let currentKey = currentData && Object.keys(item).find(key => {
                                        if (formData.type === 'date') {
                                            return key && key.includes(formData.label)
                                        }
                                        return key && key.includes(field.label)
                                    });

        
                                    let value = item && item[currentKey]

               
                                    if (formData.type === 'name') {
                                        let key = (formData.label === 'Parent' || formData.label === 'Instructor') ? `${formData.label} ${field.label}` : field.label;
                                      
                                        if(item[`"${key}"`]) {
                                            value = parseValues(item[`"${key}"`]);
                                        }
                                        else {
                                            value = parseValues(item[`${key}`]);
                                        }
                                        console.log('item',item)
                                        value = convertToQuotedString(value);
                          
                                    }

                                    else if ((field.tag.includes('multipleChoice') || field.tag.includes('dropdown')) && value) {
                                   

                                        value = parseValues(value);
               
                                        value = field.options.find(opt => opt.label.includes(removeCarriageReturn(value)) ||  opt.name.includes(removeCarriageReturn(value)));
                    
                                        if (typeof value === 'object') {
                                            value = JSON.stringify({ [value.name]: value.label });
                                        }

                                    }

                                    else if (/* field.type === 'text' &&  */formData.type === 'date') {
                                        const dateValue = item[parentKey] && item[parentKey].split(/[-/]/);

                                        if (Array.isArray(dateValue) && dateValue.length > 0) {
                                            if (field.label === 'YYYY') {
                                                value = parseValues(dateValue[2]);
                                                value = removeCarriageReturn(value);
                                            }
                                            else if (field.label === 'DD') {
                                                value = parseValues(dateValue[1])
                                            }
                                            else if (field.label === 'MM') {
                                                value = parseValues(dateValue[0])
                                            }
                                        }

                                    }

                                    else {
                                        value = convertToQuotedString(value);
                                    }

                                    return {
                                        ...field,
                                        value
                                    }

                                }
                                return {
                                    ...field
                                }
                            });

                            return {
                                ...formData,
                                fields: updatedFields
                            }
                        });

                        return {
                            formData: formContentWithValues,
                            application: existingApplication || null
                        }
                    }).map((item, index) => {
                    
                        return {
                            ...form,
                            application_id: item?.application?.app_id,
                            child_id: item?.application?.child?.ch_id,
                            form: form?.form_id,
                            vendor,
                            form_contents: {
                                formTitle: form?.form_contents?.formTitle,
                                formData: item.formData
                            }
                        }
                    });

                    console.log('formWithValues',formWithValues)
                    setCurrentFormPayload(formWithValues);
                }
                // END OF CUSTOM FORM IMPORT DATA //
                else {
                    console.log('Imported!!!!! importedData', importedData)

                    const parentInitialIndex = importedColumns.findIndex(col => col.includes('Parent'));
                    console.log('Imported!!!!! parentInitialIndex', parentInitialIndex)
                    const formattedApplication = importedData.map(item => {

                        const childInfo = item.slice(0, parentInitialIndex);
                        const parentInfo = item.slice(parentInitialIndex);

                        console.log('Imported!!!!! childInfo', childInfo)
                        console.log('Imported!!!!! parentInfo', parentInfo)

                        let childPayload = {};
                        let parentPayload = {};


                        Object.keys(childFields).forEach((key, index) => {
                            childPayload[key] = parseValues(childInfo[index]);
                        });

                        Object.keys(parentFields).forEach((key, index) => {
                            parentPayload[key] = parseValues(parentInfo[index]);
                        });

                

                        return {
                            child: {
                                ...childPayload,
                                create_profile: parentPayload?.create_profile ? true : false
                            },
                            parents: {
                                ...parentPayload,
                                create_profile: parentPayload?.create_profile ? true : false
                            },
                            vendor,
                            is_lot: isLot ? 1 : 0
                        }

                    });

                    console.log('formattedApplication', formattedApplication)
                    console.log('formattedApplicationnnn', JSON.stringify({
                        data: formattedApplication
                    }))

                    setCurrentFormPayload(formattedApplication);


                }

            }


            // console.log('e.target.result', rows);
        }

        reader.readAsText(file);
    }

    const handleUploadCustomForm = async () => {
        try {

            if (currentFormPayload) {
                let updatedPayload = [...(currentFormPayload || [])];

                if (createProfileFeature) {
                    updatedPayload = formType === 'custom' ? currentFormPayload.map(item => {

                        let parentAccountPayload = {};

                        if (isCreateProfile) {

                            const loginForms = item.form_contents.formData.find(frm => frm.type === 'login');
                            const nameForms = item.form_contents.formData.find(frm => (frm.label.toLowerCase() === 'parent' || frm.label.toLowerCase() === 'instructor') || frm.type === 'name');

                            if (loginForms && nameForms) {
                                const loginDetails = loginForms?.fields?.reduce((accum, field) => {
                                    return {
                                        ...accum,
                                        [field.type]: field.value && field.value.replace(/\\|"|"/g, '')
                                    }
                                }, {});

                                const nameDetails = nameForms?.fields?.reduce((accum, field) => {
                                    const fieldName = field.label.replace(/\s+/g, '').toLowerCase();
                                    return {
                                        ...accum,
                                        [fieldName]: field.value && field.value.replace(/\\|"|"/g, '')
                                    }
                                }, {});

                                parentAccountPayload = {
                                    ...loginDetails,
                                    ...nameDetails
                                }

                            }



                        }
                        return {
                            ...item,
                            account_details: isCreateProfile ? parentAccountPayload : null,
                            create_profile: isCreateProfile
                        }
                    }) : currentFormPayload.map(item => {
       
                        return {
                            ...item,
                            child: {
                                ...item.child,
                                birthdate: isValidDate(item?.child?.birthdate) ? format(new Date(formatDate(item.child.birthdate)), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                                has_suspended: item.child.has_suspended && item.child.has_suspended.toLowerCase() === 'yes' ? 1 : 0,
                                create_profile: isCreateProfile
                            },
                            parents: {
                                ...item.parents,
                                age: removeCarriageReturn(item.parents.age), // LAST FIELD FROM CSV
                                birthdate: isValidDate(item?.parents?.birthdate) ? format(new Date(formatDate(item.parents.birthdate)), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                                create_profile: isCreateProfile
                            },
                            vendor,
                            is_lot: isLot ? 1 : 0
                        }
                    });
                }

                console.log('updatedPayload', updatedPayload)


                setIsUploadLoading(true);
                await importCustomForm(updatedPayload, formType);
                setIsUploadLoading(false);
                setIsImportSuccess(true);
            }
        } catch (e) {
            console.log('handleUploadCustomForm e', e)
        }
        finally {
            refreshData();
            setTimeout(() => {
                setIsModalVisible(false);
            }, 2000);
        }
    }


    const handleModalChange = () => {
        setIsModalVisible(!isModalVisible);
    }

    const handleCreateProfileChange = () => {
        setIsCreateProfile(!isCreateProfile);
    }


    const handleExportWithDataChange = e => {

        const { checked } = e.target;

        if (checked) {

            let data = [];
            if (formType === 'mentoring') {
                data = selectedApplications.map(item => {
                    let childData = Object.keys(childFields).reduce((accum, key) => {
                        if (key === 'application_id') {
                            return [
                                ...accum,
                                item.id
                            ]
                        }
                        return [
                            ...accum,
                            item.child[key]
                        ]
                    }, []);

                    let parentData = Object.keys(parentFields).reduce((accum, key) => {
                        return [
                            ...accum,
                            item?.parents[0] && item.parents[0][key]
                        ]
                    }, []);


                    return [...childData, ...parentData]
                });
            }
            else {

                data = selectedApplications.map(item => {
                    let fields = item.form_contents.formData.map(item2 => {

                        let values = []
                      
                        if(item2.type === 'dropDown' || item2.type === 'multipleChoice') {
                    
                            let value = isValidJSONString(item2.fields[0].value) ? JSON.parse(item2.fields[0].value) : item2.fields[0].value;

                            value = Object.values(value)[0];
                          
                            values = [(value || '')];
                        }
                        else if (item2.groupType === 'standard' && !['Student ID', 'Unique ID'].includes(item2.label)) {
                            values = [(item2.fields[0].value || '')]
                        }
                        else if (item2.groupType === 'prime') {

                            if (item2.type === 'date' && item2.fields.length > 0) {
                                values = [`${item2.fields[2].value}-${item2.fields[0].value}-${item2.fields[1].value}`]
                            }
                            else {
                                values = item2.fields.map(item3 => parseValues(item3.value || ''))
                            }
                        }


                        return [...values]
                    });

                    fields = [item.app_id, item?.child?.ch_id, item?.child?.new_childId, ...fields]
                    return fields;

                })

                data = data.map(item => item.flat());
            }

            setExistingData(data)

        }
        else {
            setExistingData([]);
        }
        setExportWithData(checked);
    }



    return <ImportExportApplicationStyled>

        {isModalVisible && <ImportExportApplicationModal>
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Import / Export Application Data</h2>
                        <span onClick={handleModalChange} className="close">
                            &times;
                        </span>
                    </div>
                    <div className="modal-container">

                        <div>
                            <input
                                type='file'
                                accept='.csv'
                                onChange={(e) => handleUpload(e.target.files[0])}
                            />
                        </div>
                        <br />
                        <div>
                            <label style={{ color: 'orange' }}>Note:</label>

                        </div>
                        {formType === 'mentoring' && <div style={{ paddingTop: 12 }}>

                            <div>
                                The mentoring CSV requires the following information:
                            </div>
                            <div style={{ paddingTop: 5 }}>
                                For both parents and children:
                            </div>
                            <ul>
                                <li>First Name</li>
                                <li>Last Name</li>
                                {/* <li>Birthdate</li>
                                <li>Gender</li> */}
                                <li>Email (Optional for children)</li>
                                <li>Additionally, parents need to provide a password.</li>
                            </ul>
                        </div>}

                        <div style={{ paddingTop: 5 }}>For date field, the format should be <i>"YYYY-MM-DD"</i></div>

                        <br />
                        {createProfileFeature &&
                            <div>
                                <label>Create Profile?</label>
                                <input type="checkbox" onChange={handleCreateProfileChange} checked={isCreateProfile} />
                            </div>}
                        <br />

                        {
                            <div>
                                <label>Export with Data</label>
                                <input type="checkbox" onChange={handleExportWithDataChange} checked={exportWithData} />
                            </div>}
                        <br />

                        {isImportSuccess && <div style={{ color: 'green', paddingBottom: 12 }}>Data has been imported successfully!</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


                            {currentFormPayload && <>
                                <button
                                    disabled={isUploadLoading}
                                    // disabled={!currentFormPayload ? true : false}
                                    id="uploadButton"
                                    // onClick={() => {
                                    //     console.log('currentFormPayload', JSON.stringify({
                                    //         data: currentFormPayload
                                    //     }))
                                    // }}
                                    onClick={handleUploadCustomForm}
                                    type="button">{isUploadLoading ? 'Uploading...' : 'Upload Data'}
                                </button>
                                <br />
                            </>}
                            <CSVLink
                                id="exportButton"
                                onClick={() => {
                                }}

                                data={[columns, ...existingData]}

                                filename={applicationName}>
                                <span >Download {applicationName} CSV</span>
                            </CSVLink>

                        </div>
                    </div>


                </div>

            </div>
        </ImportExportApplicationModal>}

        <button

            id="uploadButton"
            // onClick={() => {
            //     console.log('currentFormPayload', JSON.stringify({
            //         data: currentFormPayload
            //     }))
            onClick={handleModalChange}

            type="button">Import / Export Application
        </button>

    </ImportExportApplicationStyled>

}

export default ImportExportApplication;