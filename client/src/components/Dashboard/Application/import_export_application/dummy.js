export const DUMMY_DATA = {
    "formTitle": "Main Form-100 Black Men of Chicago Mentoring Registration",
    "formData": [
        {
            "id": "4f9795f9-c199-49da-a5c0-8c4c8f8c8940",
            "label": "Section Break - Form Intro",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_4f9795f9-c199-49da-a5c0-8c4c8f8c8940",
                    "label": "For all new and returning mentees/parents, please complete this form to register.  If you have any questions about the form or the required releases, please reach out to Tim Turner at tim.turner@100bmc.org.",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "eb9f9065-dd19-4cfe-8b8a-2833d5a60e01",
            "label": "Section Break 0 - Space",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_eb9f9065-dd19-4cfe-8b8a-2833d5a60e01",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "54109590-0d97-422c-909f-a968f65b5982",
            "label": "Parent/Guardian Information",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_54109590-0d97-422c-909f-a968f65b5982",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "5fb9e9f0-3447-489c-81a0-4ca863e7a630",
            "label": "Parent / Guardian Name",
            "type": "name",
            "fields": [
                {
                    "id": "select0_5fb9e9f0-3447-489c-81a0-4ca863e7a630",
                    "label": "Title",
                    "type": "title",
                    "tag": "select",
                    "placeholder": "Title",
                    "column": "1",
                    "value": "\"Mr.\"",
                    "options": [
                        {
                            "name": "mr",
                            "label": "Mr.",
                            "tag": "checkbox"
                        },
                        {
                            "name": "mrs",
                            "label": "Mrs.",
                            "tag": "checkbox"
                        },
                        {
                            "name": "ms",
                            "label": "Ms.",
                            "tag": "checkbox"
                        }
                    ],
                    "requireAddOption": true,
                    "fixedWidth": true
                },
                {
                    "id": "input1_5fb9e9f0-3447-489c-81a0-4ca863e7a630",
                    "label": "First Name",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "First Name",
                    "column": "1",
                    "value": "\"Test\"",
                    "required": true
                },
                {
                    "id": "input2_5fb9e9f0-3447-489c-81a0-4ca863e7a630",
                    "label": "Middle Name",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Middle Name",
                    "column": "1",
                    "value": "\"A\""
                },
                {
                    "id": "input3_5fb9e9f0-3447-489c-81a0-4ca863e7a630",
                    "label": "Last Name",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Last Name",
                    "column": "1",
                    "value": "\"Test\"",
                    "required": true
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\",\"applyToAll\":true}"
        },
        {
            "id": "24fa9d3c-f4ee-4619-8248-52f43d891495",
            "label": "Parent / Guardian Phone",
            "type": "phone",
            "fields": [
                {
                    "id": "select0_24fa9d3c-f4ee-4619-8248-52f43d891495",
                    "label": "Type",
                    "type": "type",
                    "tag": "select",
                    "placeholder": "Type",
                    "value": "\"Cell\"",
                    "options": [
                        {
                            "name": "Cell",
                            "label": "Cell"
                        },
                        {
                            "name": "Home",
                            "label": "Home"
                        },
                        {
                            "name": "Work",
                            "label": "Work"
                        }
                    ],
                    "requireAddOption": true
                },
                {
                    "id": "input1_24fa9d3c-f4ee-4619-8248-52f43d891495",
                    "label": "Phone",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Phone",
                    "value": "\"(123) 123-1231\""
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "4d025193-c514-4a3a-ade1-1244d479e322",
            "label": "Section Break - Create Account",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_4d025193-c514-4a3a-ade1-1244d479e322",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "cadeda5e-432c-4f9d-aca0-477f5a5edd36",
            "label": "Create Your 100BMC Registration Account",
            "type": "login",
            "fields": [
                {
                    "id": "input0_cadeda5e-432c-4f9d-aca0-477f5a5edd36",
                    "label": "Email Address",
                    "type": "email",
                    "tag": "input",
                    "placeholder": "Email",
                    "column": "4",
                    "value": "\"testtt@gmail.com\"",
                    "required": true
                },
                {
                    "id": "input1_cadeda5e-432c-4f9d-aca0-477f5a5edd36",
                    "label": "Password",
                    "type": "password",
                    "tag": "input",
                    "placeholder": "Password",
                    "column": "2",
                    "value": "\"P@ssw0rd1234\"",
                    "required": true
                },
                {
                    "id": "input2_cadeda5e-432c-4f9d-aca0-477f5a5edd36",
                    "label": "Confirm Password",
                    "type": "confirmPassword",
                    "tag": "input",
                    "placeholder": "Confirm Password",
                    "column": "2",
                    "value": "\"P@ssw0rd1234\"",
                    "required": true
                }
            ],
            "groupType": "prime",
            "settings": {
                "instruction": {
                    "include": true,
                    "value": "You can now create your 100BMC Mentoring/Mentee account here.  You can log into your account and update your (or child's) information at any time throughout their enrollment in the program..    "
                }
            },
            "isActive": false,
            "allowAddField": false,
            "gridMax": 4,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "8a7ba89e-38b5-4aed-b993-ce2e0f3897e8",
            "label": "Verify Email",
            "type": "email",
            "fields": [
                {
                    "id": "select0_8a7ba89e-38b5-4aed-b993-ce2e0f3897e8",
                    "label": "Type",
                    "type": "type",
                    "tag": "select",
                    "placeholder": "Type",
                    "value": "\"Personal\"",
                    "options": [
                        {
                            "name": "Personal",
                            "label": "Personal"
                        }
                    ],
                    "requireAddOption": true
                },
                {
                    "id": "input1_8a7ba89e-38b5-4aed-b993-ce2e0f3897e8",
                    "label": "Email",
                    "type": "email",
                    "tag": "input",
                    "placeholder": "Email",
                    "value": "\"testtt@gmail.com\"",
                    "required": true
                }
            ],
            "groupType": "prime",
            "settings": {
                "instruction": {
                    "include": true,
                    "value": "Please enter your email a 2nd time to verify the correct email address to use."
                }
            },
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\",\"applyToAll\":true}"
        },
        {
            "id": "ca09e5ae-a715-4167-a32a-33cefda3aad1",
            "label": "Important Note:",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_ca09e5ae-a715-4167-a32a-33cefda3aad1",
                    "label": "You will receive an email from the sender  'bcombs'  to validate your email and new 100BMC registration account.",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\",\"applyToAll\":false}"
        },
        {
            "id": "5ddfd4e4-6213-4015-876b-7bd88e59ed66",
            "label": "Section Break 1 - Space",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_5ddfd4e4-6213-4015-876b-7bd88e59ed66",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "228d7afc-b028-4204-acb2-b006ca10fb1b",
            "label": "Mentee Information",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_228d7afc-b028-4204-acb2-b006ca10fb1b",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "14ae5b0b-c3d7-4b7b-b16c-b2dcfc934fc5",
            "label": "Mentee Profile Pic (Optional)",
            "type": "primeFile",
            "fields": [
                {
                    "id": "profileImage0_14ae5b0b-c3d7-4b7b-b16c-b2dcfc934fc5",
                    "label": "Profile Image",
                    "tag": "profileImage",
                    "value": "",
                    "limit": 1,
                    "errorMessage": "Only PNG, JPG, JPEG files are supported.",
                    "allowTypes": [
                        {
                            "label": "PNG",
                            "ext": [
                                ".png"
                            ],
                            "selected": true
                        },
                        {
                            "label": "JPG, JPEG",
                            "ext": [
                                ".jpg",
                                ".jpeg"
                            ],
                            "selected": true
                        }
                    ],
                    "required": false
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "8b9e39c6-30a3-4753-bb67-ca312f76261d",
            "label": "Mentee Name",
            "type": "name",
            "fields": [
                {
                    "id": "select0_8b9e39c6-30a3-4753-bb67-ca312f76261d",
                    "label": "Title",
                    "type": "title",
                    "tag": "select",
                    "placeholder": "Title",
                    "column": "1",
                    "value": "\"Prefix (not required)\"",
                    "options": [
                        {
                            "name": "prefix (not required)",
                            "label": "Prefix (not required)",
                            "tag": "checkbox"
                        }
                    ],
                    "requireAddOption": true,
                    "fixedWidth": true
                },
                {
                    "id": "input1_8b9e39c6-30a3-4753-bb67-ca312f76261d",
                    "label": "First Name",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "First Name",
                    "column": "1",
                    "value": "\"Test\"",
                    "required": true
                },
                {
                    "id": "input2_8b9e39c6-30a3-4753-bb67-ca312f76261d",
                    "label": "Middle Name",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Middle Name",
                    "column": "1",
                    "value": "\"Test\""
                },
                {
                    "id": "input3_8b9e39c6-30a3-4753-bb67-ca312f76261d",
                    "label": "Last Name",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Last Name",
                    "column": "1",
                    "value": "\"Test\"",
                    "required": true
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "ab276ec1-eb37-4e7f-adf5-ba227b52bfaa",
            "label": "Mentee Email",
            "type": "email",
            "fields": [
                {
                    "id": "select0_ab276ec1-eb37-4e7f-adf5-ba227b52bfaa",
                    "label": "Type",
                    "type": "type",
                    "tag": "select",
                    "placeholder": "Type",
                    "value": "\"Personal\"",
                    "options": [
                        {
                            "name": "Personal",
                            "label": "Personal"
                        },
                        {
                            "name": "Work",
                            "label": "Work"
                        }
                    ],
                    "requireAddOption": true
                },
                {
                    "id": "input1_ab276ec1-eb37-4e7f-adf5-ba227b52bfaa",
                    "label": "Email",
                    "type": "email",
                    "tag": "input",
                    "placeholder": "Email",
                    "value": "\"qweqweqwe@gmail.com\""
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "31c30d45-38c7-428c-9f49-6a768cf77d01",
            "label": "Mentee Phone",
            "type": "phone",
            "fields": [
                {
                    "id": "select0_31c30d45-38c7-428c-9f49-6a768cf77d01",
                    "label": "Type",
                    "type": "type",
                    "tag": "select",
                    "placeholder": "Type",
                    "value": "\"Mobile (10 digit)\"",
                    "options": [
                        {
                            "name": "mobile (10 digit)",
                            "label": "Mobile (10 digit)"
                        }
                    ],
                    "requireAddOption": true
                },
                {
                    "id": "input1_31c30d45-38c7-428c-9f49-6a768cf77d01",
                    "label": "Phone",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Phone",
                    "value": "\"(123) 123-1231\""
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "19961eef-beec-4c76-902d-5331b6b3b067",
            "label": "Mentee Grade",
            "type": "multipleChoice",
            "fields": [
                {
                    "id": "multipleChoice0_19961eef-beec-4c76-902d-5331b6b3b067",
                    "type": "multipleChoice",
                    "tag": "multipleChoice",
                    "column": "1",
                    "value": "{\"option1\":\"6th\"}",
                    "required": true,
                    "options": [
                        {
                            "name": "option1",
                            "label": "6th",
                            "tag": "radio"
                        },
                        {
                            "name": "option2",
                            "label": "7th",
                            "tag": "radio"
                        },
                        {
                            "name": "option3",
                            "label": "8th",
                            "tag": "radio"
                        },
                        {
                            "name": "option4",
                            "label": "Freshman",
                            "tag": "radio"
                        },
                        {
                            "name": "option5",
                            "label": "Sophomore",
                            "tag": "radio"
                        },
                        {
                            "name": "option6",
                            "label": "Junior",
                            "tag": "radio"
                        },
                        {
                            "name": "option7",
                            "label": "Senior",
                            "tag": "radio"
                        },
                        {
                            "name": "other",
                            "label": "Other:",
                            "tag": "radio"
                        }
                    ],
                    "isMultiple": false
                }
            ],
            "groupType": "standard",
            "settings": {
                "logic": {
                    "include": false
                }
            },
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": true,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": true,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "6f31757e-2fdd-423e-ba49-d6ea89b19c8e",
            "label": "Mentee School",
            "type": "singleLineText",
            "fields": [
                {
                    "id": "input0_6f31757e-2fdd-423e-ba49-d6ea89b19c8e",
                    "label": "Single Line Text",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Single Line Text",
                    "column": "1",
                    "value": "\"Test\""
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": true,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": true,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "e1a0df92-95bc-4f55-b0c8-1d595db97514",
            "label": "Mentee GPA (if applicable)",
            "type": "singleLineText",
            "fields": [
                {
                    "id": "input0_e1a0df92-95bc-4f55-b0c8-1d595db97514",
                    "label": "Single Line Text",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Single Line Text",
                    "column": "1",
                    "value": "\"Test\""
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": true,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": true,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "4544ed36-4f8a-4e44-b1f6-07a2249d8280",
            "label": "Section Break 2 - Space",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_4544ed36-4f8a-4e44-b1f6-07a2249d8280",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "8441c211-a0c3-4450-a426-2940d606300f",
            "label": "Additional Registration Information",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_8441c211-a0c3-4450-a426-2940d606300f",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "5ababe37-26b4-47a6-b57e-66ac75035846",
            "label": "Note: To register a 2nd mentee, please contact Tim Turner at tim.turner@100bmc.org.",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_5ababe37-26b4-47a6-b57e-66ac75035846",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"]}"
        },
        {
            "id": "0bac2ba2-931f-4406-83fb-44900c4f0f75",
            "label": "Interest - Please briefly describe your reasons for registering your mentee and what do you hope to accomplish through the mentoring program",
            "type": "paragraphText",
            "fields": [
                {
                    "id": "textarea0_0bac2ba2-931f-4406-83fb-44900c4f0f75",
                    "label": "Paragraph Text",
                    "type": "text",
                    "tag": "textarea",
                    "placeholder": "Paragraph Text",
                    "column": "1",
                    "value": "\"Test\""
                }
            ],
            "groupType": "standard",
            "settings": {
                "instruction": {
                    "include": true
                }
            },
            "isActive": false,
            "allowAddField": true,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": true,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "8449f038-0abb-4e1e-aaac-1b743c8cf593",
            "label": "Preferred Mentoring Site",
            "type": "multipleChoice",
            "fields": [
                {
                    "id": "multipleChoice0_8449f038-0abb-4e1e-aaac-1b743c8cf593",
                    "type": "multipleChoice",
                    "tag": "multipleChoice",
                    "column": "1",
                    "value": "{\"option1\":\"South Side: Hyde Park Academy High School, 6220 South Stony Island, Chicago, IL\"}",
                    "required": true,
                    "options": [
                        {
                            "name": "option1",
                            "label": "South Side: Hyde Park Academy High School, 6220 South Stony Island, Chicago, IL",
                            "tag": "radio"
                        },
                        {
                            "name": "option2",
                            "label": "South Suburbs: South Suburban College, 1633 South Kilbourn Avenue, Oak Forest, IL",
                            "tag": "radio"
                        },
                        {
                            "name": "option3",
                            "label": "West Side: BUILD, Inc.  5100 West Harrison, Chicago, IL",
                            "tag": "radio"
                        },
                        {
                            "name": "option4",
                            "label": "West Suburbs: DuPage AME Church, 4300 Yackley Avenue, Lisle, IL",
                            "tag": "radio"
                        },
                        {
                            "name": "option5",
                            "label": "Brogrammers",
                            "tag": "radio"
                        }
                    ],
                    "isMultiple": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": true,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": true,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "7150d8b0-2d4e-4d5c-95fc-79602307aa32",
            "label": "Section Break  3- Space",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_7150d8b0-2d4e-4d5c-95fc-79602307aa32",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
            "label": "Mailing Address (Street Name & Number/Unit)",
            "type": "address",
            "fields": [
                {
                    "id": "input0_3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
                    "label": "Street Address",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Street Address",
                    "column": "4",
                    "value": "\"Test\""
                },
                {
                    "id": "input1_3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
                    "label": "Street Address Line 2",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "Street Address Line 2",
                    "column": "4",
                    "value": "\"Test\""
                },
                {
                    "id": "select2_3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
                    "label": "State / Province / Region",
                    "type": "state",
                    "tag": "select",
                    "placeholder": "State / Province / Region",
                    "column": "2",
                    "value": "\"AK\""
                },
                {
                    "id": "input3_3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
                    "label": "City",
                    "type": "text",
                    "tag": "input",
                    "placeholder": "City",
                    "column": "2",
                    "value": "\"Test\""
                },
                {
                    "id": "input4_3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
                    "label": "Postal / Zip Code",
                    "type": "zipcode",
                    "tag": "input",
                    "placeholder": "Postal / Zip Code",
                    "column": "2",
                    "value": "\"12312\""
                },
                {
                    "id": "select5_3d3f2c8f-af75-4a0a-94e9-6975772c7e06",
                    "label": "Country",
                    "type": "country",
                    "tag": "select",
                    "placeholder": "Country",
                    "column": "2",
                    "value": "\"BB\""
                }
            ],
            "groupType": "prime",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 4,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "ddd79a8b-f851-47e9-9bf2-24820abb9725",
            "label": "Section Break 4 - Space",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_ddd79a8b-f851-47e9-9bf2-24820abb9725",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "4e71f558-5f3c-4e48-979d-ab719176642d",
            "label": "Please note that the majority of communication regarding the mentoring program will be conducted via email.  As such, we ask that you please make an effort to check the email account provided above at least once a week to remain informed about upcoming topics, schedule changes, and other pertinent information related to the program.  Please select an option below:",
            "type": "multipleChoice",
            "fields": [
                {
                    "id": "multipleChoice0_4e71f558-5f3c-4e48-979d-ab719176642d",
                    "type": "multipleChoice",
                    "tag": "multipleChoice",
                    "column": "1",
                    "value": "{\"option1\":\"I can commit to checking email once a week for information regarding the mentoring program\",\"option2\":\"I would prefer to receive text messages regarding program updates\"}",
                    "required": true,
                    "options": [
                        {
                            "name": "option1",
                            "label": "I can commit to checking email once a week for information regarding the mentoring program",
                            "tag": "radio"
                        },
                        {
                            "name": "option2",
                            "label": "I would prefer to receive text messages regarding program updates",
                            "tag": "radio"
                        },
                        {
                            "name": "other",
                            "label": "Other:",
                            "tag": "radio"
                        }
                    ],
                    "isMultiple": true
                }
            ],
            "groupType": "standard",
            "settings": {
                "logic": {
                    "include": false,
                    "items": "[{\"name\":\"option2\",\"pageId\":\"7ba042dd-2790-4233-8648-afd66d211f15\"}]"
                }
            },
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": true,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": true,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "e1b2dd8e-8cd9-4c9f-86a0-113a8b723829",
            "label": "Section Break 5 - Space",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_e1b2dd8e-8cd9-4c9f-86a0-113a8b723829",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "4feea7cd-4183-4be1-8c47-6226a4c18200",
            "label": "Parent/Guardian Acknowledgement",
            "type": "sectionBreak",
            "fields": [
                {
                    "id": "sectionBreak0_4feea7cd-4183-4be1-8c47-6226a4c18200",
                    "label": "",
                    "tag": "sectionBreak",
                    "value": "",
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": false,
            "gridMax": 1,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": false,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "380670a4-b4d1-45c1-80cb-7b0259e20fff",
            "label": "Please read and acknowledge the following:",
            "type": "paragraphText",
            "fields": [
                {
                    "id": "textarea0_380670a4-b4d1-45c1-80cb-7b0259e20fff",
                    "label": "Paragraph Text",
                    "type": "text",
                    "tag": "textarea",
                    "placeholder": "Parent/Guardian:\nI hereby certify that I am the parent or legal guardian of the minor child whose name and address appear below.  I further certify that I have the authority and capacity to grant permission and to provide consent for such minor child to participate in the events and activities sponsored by the 100 Black Men of Chicago, Inc. (100BMC).",
                    "column": "3",
                    "value": "",
                    "validation": {},
                    "required": false
                },
                {
                    "id": "textarea1_380670a4-b4d1-45c1-80cb-7b0259e20fff",
                    "label": "Paragraph Text",
                    "type": "text",
                    "tag": "textarea",
                    "placeholder": "Transportation:\nI understand that participation by the minor child in 100BMC events and activities may require the transportation of such minor child from time to time, and the minor child's participation in 100BMC events and activities will be appropriately chaperoned by 100BMC members.",
                    "column": "3",
                    "value": "",
                    "validation": {},
                    "required": false
                },
                {
                    "id": "textarea2_380670a4-b4d1-45c1-80cb-7b0259e20fff",
                    "label": "Paragraph Text",
                    "type": "text",
                    "tag": "textarea",
                    "placeholder": "Medical:\nI further understand that injuries to the minor child may occur and that such injuries may require medical attention.  In such case(s), I hereby authorize the provision of necessary medical attention to treat such minor child's injuries, and agree that 100BMC, its officers, members, agents, sponsors, and volunteers will not be legally responsible for such medical attention.",
                    "column": "3",
                    "value": "",
                    "validation": {},
                    "required": false
                },
                {
                    "id": "textarea3_380670a4-b4d1-45c1-80cb-7b0259e20fff",
                    "label": "Paragraph Text",
                    "type": "text",
                    "tag": "textarea",
                    "placeholder": "Media/Image:\nI hereby authorize 100BMC to use such minor child's photo, name, image and the like, as well as all written information an d other tangible or intangible material which have been created by, or in connection with, such minor child's participation in 100BMC activities and events (collectively \"Materials\").  I understand and agree that such Materials may be used by 100BMC for any purpose in its sole discretion and agree that all proprietary rights to the Materials are the sole and exclusive property of 100BMC, free from any claim or retention of rights thereto.",
                    "column": "3",
                    "value": "",
                    "validation": {},
                    "required": false
                }
            ],
            "groupType": "standard",
            "settings": {},
            "isActive": false,
            "allowAddField": true,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": true,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": true,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        },
        {
            "id": "8f069e8c-39f5-4895-abc2-b61f3e4ef0ff",
            "label": "I acknowledge - yes",
            "type": "terms",
            "fields": [
                {
                    "id": "checkbox0_8f069e8c-39f5-4895-abc2-b61f3e4ef0ff",
                    "label": "",
                    "type": "terms",
                    "tag": "checkbox",
                    "column": "2",
                    "value": "true",
                    "required": true
                },
                {
                    "id": "input1_8f069e8c-39f5-4895-abc2-b61f3e4ef0ff",
                    "label": "Title",
                    "type": "terms",
                    "tag": "input",
                    "placeholder": "Parent/Guardian",
                    "column": "4",
                    "value": "\"{\\\"value\\\":\\\"qweqwe\\\",\\\"date\\\":\\\"09/22/2023\\\"}\"",
                    "required": true,
                    "fixedWidth": true
                },
                {
                    "id": "textarea2_8f069e8c-39f5-4895-abc2-b61f3e4ef0ff",
                    "label": "Context",
                    "type": "terms",
                    "tag": "textarea",
                    "placeholder": "I acknowledge and agree that I have read the foregoing or had the foregoing read and explained to me and that I fully understand the content and intent of this parental/guardian authorization and release.",
                    "column": "4",
                    "value": "",
                    "fixedWidth": true,
                    "required": false
                }
            ],
            "groupType": "prime",
            "settings": {
                "instruction": {
                    "include": false,
                    "value": "Please check to acknowledge and accept via electronic signature."
                }
            },
            "isActive": false,
            "allowAddField": false,
            "gridMax": 3,
            "includeLogic": false,
            "includeValidation": false,
            "hasSettings": true,
            "supportMultiple": false,
            "showLabel": false,
            "format": "{\"presetColors\":[\"#de1a1a\",\"#ff007b\",\"#8f5772\",\"#a5a4b7\"],\"color\":\"#ff7400\"}"
        }
    ]
}