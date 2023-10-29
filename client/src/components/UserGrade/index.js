import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
// import { useParams } from "@reach/router";
import { useDispatch, useSelector } from "react-redux";
// import { format, setSeconds, setMilliseconds } from 'date-fns';



// import ErrorMessage from "../../helpers/ErrorMessage";
// import { militaryToRegularTime } from '../../helpers/Date';

import { requestAddUpdateStudentCumulative } from '../../redux/actions/Grades'

import Confirmation from "../../helpers/Confirmation";

import Loading from "../../helpers/Loading.js";




// import { s3BucketRootPath } from '../../constants/aws';

// function getCurrentDateTimeString() {
//   const currentDate = new Date();
//   const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");
//   return formattedDate.slice(0, -2) + "00";
// }

const GRADE_OPTIONS = [
  { value: null, label: 'Please Select' },
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
  ...Array(9).fill().map((e, i) => ({ value: i + 4, label: `${i + 4}th` }))
];

const CLASS_TYPE = [
  { value: 'Arts', label: 'Arts' },
  { value: 'Math', label: 'Math' },
  { value: 'English', label: 'English' },
  { value: 'Science', label: 'Science' },
  { value: 'Music', label: 'Music' },
  { value: 'Social Studies', label: 'Social Studies' },

]

const REPORTING_PERIOD_OPTIONS = [
  { value: 'grade_quarter_1', label: 'Q1 (Semester 1)' },
  { value: 'grade_quarter_2', label: 'Q2 (Semester 1)' },
  { value: 'mid_final_grade', label: 'Semester 1 Final' },
  { value: 'grade_quarter_3', label: 'Q3 (Semester 2)' },
  { value: 'grade_quarter_4', label: 'Q4 (Semester 2)' },
  { value: 'final_grade', label: 'Semester 2 Final' },
];

const QUARTER_PERIOD = {
  grade_quarter_1: 'help_q1',
  grade_quarter_2: 'help_q2',
  grade_quarter_3: 'help_q3',
  grade_quarter_4: 'help_q4'
}

const GPA_OPTIONS = [
  { value: null, label: 'Please select GPA value' },
  { value: 0, label: 0 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
];

const SUB_GPA_OPTIONS = [
  { value: null, label: 'Please select GPA value' },
  { value: 0, label: 0 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 }
]

// Q1 (Semester 1)
// Q2 (Semester 1)
// Semester 1 Final
// Q3 (Semester 2)
// Q4 (Semester 2)
// Semester 2 Final


const removeKeysFromArrayObjects = (arr, keysToRemove) => {
  return arr.map((obj) => {
    const newObj = { ...obj };
    keysToRemove.forEach((key) => delete newObj[key]);
    return newObj;
  });

}

// function DropdownWithOptionalText (props) {

//   const [selectedOption, setSelectedOption] = useState('');
//   const [customOption, setCustomOption] = useState('');

//   const handleSelectChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const handleCustomInputChange = (event) => {
//     setCustomOption(event.target.value);
//   };

//   return (
//     <div>
// <select value={selectedOption} onChange={handleSelectChange}>
//   <option value="">Select an option</option>
//   <option value="option1">Option 1</option>
//   <option value="option2">Option 2</option>
//   <option value="option3">Option 3</option>

//   {CLASS_TYPE.map(item => {
//      <option value={item.value}>{item.label}</option>
//   })}
// </select>
//       {selectedOption === '' && (
//         <input
//           type="text"
//           placeholder="Enter a custom option"
//           value={customOption}
//           onChange={handleCustomInputChange}
//         />
//       )}

//     </div>
//   );
// }


const UserGradeStyled = styled.form`
  display: flex;
  flex-direction: columns;
  justify-content: center;
  padding: 14px !important;
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input, select {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    outline: 0;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  input:focus, select:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: 10px !important;
  }
  button[type="button"] {
    padding: 10px;
    display: block;
    margin: 1em auto;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    width: 100% !important;
  }

  button:disabled {
    background-color: #ccc; 
    color: #888; 
    cursor: not-allowed; 
  }

 
  #authOptions p {
    font-weight: bold;
    text-align: center;
    padding: 0;
    margin-top: 1em;
    font-size: ${({ theme }) => theme.p.fontSize} !important;
  }
  #authOptions p a {
    color: ${({ theme }) => theme.anchor.textColor.primary};
    font-size: ${({ theme }) => theme.anchor.fontSize} !important;
    text-decoration: none;
  }
  #socials > * {
    width: initial;
  }
  p.error {
    text-align: left !important;
  }
  p.error-size {
    font-size: 14px !important;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    #authOptions p:first-child {
      text-align: left;
    }
    #authOptions p:last-child {
      text-align: right;
    }
    button[type="submit"] {
      width: 300px;
    }
  }
  #g-recaptcha {
    margin-top: 3em;
  }

  .gradeInfo {
    display: flex;
    flex-direction: row;
  }

    @media (max-width: 769px) {
      .gradeInfo {
        display: flex;
        flex-direction: column !important;
        width:100% !important;
      }

      .gradeForms {
        display: flex;
        flex-direction: column;
        background-color: white;
      }

      .qrCodeContainer{
        display: none;
      }
  }

  @media (min-width: 770px) {
   
    .qrCodeContainer{
      display: flex;
      justify-content: center;
    }

    .gradeForms {
      display: flex;
      flex-direction: column;
      background-color: white;
      width: 500px !important;
  
    }
  
}

`;

/*
  @media (max-width: 769px) {
    .gradeInfo {
      display: flex;
      flex-direction: column !important;
    }
  }
*/

const classType = {
  class: '',
  subject: '',
  final_grade: 0,
  designation: ''
};


const defaultCumulative = {
  application_type: '',
  attachment: null,
  class_name: null,
  class_teacher: null,
  class_type: null,
  final_student_rank: 0,
  mid_student_rank: 0,
  scale: 0,
  school_designation: null,
  school_name: null,
  school_type: null,
  school_year_end: null,
  school_year_frame: null,
  school_year_start: null,
}

const getCurrentUserAndGrades = async data => {
  const response = await fetch(`${process.env.API_HOST}/api/child/grades/search`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

const getPageQrCode = async () => {
  const response = await fetch(`${process.env.API_HOST}/api/qr/grade/page`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  return response.json();
}


export default function UserGrade(props) {

  // C110367
  const [currentChild, setCurrentChild] = useState({
    firstname: "",
    lastname: "",
    childId: "C110367",
  });

  const [qrCode, setQrCode] = useState('');

  const [currentChildDetails, setCurrentChildDetails] = useState(null);
  const [isFindingUser, setIsFindingUser] = useState(false);
  // const [attendanceMessage, setAttendanceMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [studentCumulative, setStudentCumulative] = useState([]);
  const [studentGrades, setStudentGrades] = useState({});
  const [defaultStudentGrades, setDefaultStudentGrades] = useState({});


  const [selectedSchoolGrade, setSelectedSchoolGrade] = useState(null);
  const [selectedReportingPeriod, setSelectedReportingPeriod] = useState('grade_quarter_1');
  const [selectedSchoolCumulative, setSelectedSchoolCumulative] = useState(null);
  const [selectedStudentGrades, setSelectedStudentGrades] = useState([{ ...classType }]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(null);


  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const currentReportingPeriod = REPORTING_PERIOD_OPTIONS.find(item => item.value === selectedReportingPeriod);

  const studentGradeLabels = Object.keys(defaultStudentGrades).map(key => {
    const currentGrade = GRADE_OPTIONS.find(item => item.value === parseInt(key));
    return currentGrade?.label
  }).join(',');

  const { gradeLoading } = useSelector(state => {
    return {
      gradeLoading: state.loading?.gradeEditLoading
    }
  })

  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const { register, handleSubmit, errors, setValue, reset } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    const triggerGetQrCode = async () => {
      try {
        const response = await getPageQrCode();
        setQrCode(response?.qr_code || '');
      } catch (err) {
        console.log('triggerGetQrCode err', err)
      }
    };

    triggerGetQrCode();
  }, []);

  const handleFindUser = async () => {
    try {
      setCurrentChildDetails({});
      setStudentGrades({})
      setDefaultStudentGrades({});
      setStudentCumulative([]);
      setUserMessage('');
      setIsFindingUser(true);
      setSelectedGradeLevel(null);

      const response = await getCurrentUserAndGrades({
        ...currentChild
      });


      if (response?.child) {

        const cumulative = response?.grade_cumulative ? response?.grade_cumulative.map(item => {
          const gpaFinal = `${item.gpa_final}`.split('.');
          const gpaSem2 = `${item.gpa_sem_2}`.split('.');
          return {
            ...item,
            gpa_final: gpaFinal.length > 0 ? gpaFinal[0] : null,
            sub_gpa_final: gpaFinal.length > 1 ? gpaFinal[1] : null,
            gpa_sem_2: gpaSem2.length > 0 ? gpaSem2[0] : null,
            sub_gpa_sem_2: gpaSem2.length > 1 ? gpaSem2[1] : null
          }
        }) : [];


        const appGroups = response?.app_groups || [];
        setStudentGrades({ ...(response.grades || {}) });
        setDefaultStudentGrades({ ...(response.grades || {}) });
        setStudentCumulative([...(cumulative || [])]);
        setCurrentChildDetails({
          ...(response?.child || {}),
          app_grp_id: appGroups[0] && appGroups[0]?.app_grp_id
        });

      }
      else {
        setUserMessage(`User Does Not Exist`)
      }

    } catch (e) {
      console.log('handleFindUser e', e)
    }
    finally {
      setIsFindingUser(false);

      setTimeout(() => {
        setUserMessage('');
      }, 5000)
    }
  }

  const handleInputChange = (id, value) => {
    setCurrentChild({
      ...currentChild,
      [id]: value
    });
  };

  const handleCumulativeInputChange = e => {
    const { name, value } = e.target;
    let subFields = {};
    // if (name === 'gpa_final' || name === 'gpa_sem_2') {
    //   let parsedValue = value;

    //   // if ((name === 'gpa_final' && parsedValue > 4) || (name === 'gpa_sem_2' && parsedValue > 5)) {
    //   //   return;
    //   // }
    //   // else {
    //   //   setSelectedSchoolCumulative({
    //   //     ...selectedSchoolCumulative,
    //   //     [name]: parsedValue
    //   //   });
    //   // }
    //   setSelectedSchoolCumulative({
    //     ...selectedSchoolCumulative,
    //     [name]: parsedValue
    //   });
    // }

    const parsedValue = parseInt(value);

    if (isNaN(parsedValue)) {

      if (name === 'gpa_final') {
        subFields = {
          sub_gpa_final: null
        }
      }
      else if (name === 'gpa_sem_2') {
        subFields = {
          sub_gpa_sem_2: null
        }
      }

    }


    setSelectedSchoolCumulative({
      ...selectedSchoolCumulative,
      [name]: !isNaN(parsedValue) ? parsedValue : null,
      ...subFields,
    });
  };



  const handleGradeInputChange = index => e => {
    const { name, checked, value } = e.target;
    const updatedStudentGrades = [...(studentGrades[selectedSchoolGrade] || [])];

    // const isGradeField = (name !== 'class') && (name !== 'subject') && (name !== 'designation');

    if (index > -1) {
      updatedStudentGrades[index] = {
        ...(studentGrades[selectedSchoolGrade][index] || {}),
        [name]: name.includes('help_') ? checked : value
      };

    }
    else {
      updatedStudentGrades = [
        ...updatedStudentGrades,
        {
          class: '',
          subject: '',
          final_grade: 0,
          designation: '',
          student_grade_cumulative_id: selectedSchoolCumulative?.student_grade_cumulative_id
        }
      ]
    }


    setStudentGrades({
      ...studentGrades,
      [selectedSchoolGrade]: [
        ...updatedStudentGrades
      ]
    });

  };


  const handleSchoolGradeChange = e => {
    const currentGradeLevel = parseInt(e.target.value);

    const currentCumulative = studentCumulative.find(item => item.year_level === currentGradeLevel)
    setSelectedGradeLevel(currentGradeLevel);
    if (currentCumulative) {
      setSelectedStudentGrades([...(studentGrades[currentGradeLevel] || [])])
      setSelectedSchoolGrade(currentGradeLevel);
      setSelectedSchoolCumulative(currentCumulative || null);
    }
    else {


      const newCumulative = {
        ...defaultCumulative,
        year_level: currentGradeLevel
      }
      setSelectedStudentGrades([...(studentGrades[currentGradeLevel] || []), newCumulative])
      setSelectedSchoolGrade(currentGradeLevel);
      setSelectedSchoolCumulative({
        ...newCumulative
      } || null);

    }

  }

  const handleAddClass = () => {
    setStudentGrades({
      ...studentGrades,
      [selectedSchoolGrade]: [
        ...(studentGrades[selectedSchoolGrade] || []),
        {
          ...classType,
          student_grade_cumulative_id: selectedSchoolCumulative?.student_grade_cumulative_id
        }
      ]
    });

  }


  const handleReview = () => {
    setIsConfirmationVisible(true);
  }


  const handleSaveGrades = () => {


    let updatedStudentCumulative = Object.keys(studentGrades).map(key => {

      let currentData = studentCumulative.find(item => item.year_level === parseInt(key));

      if (currentData) {
        currentData = currentData && selectedSchoolCumulative && selectedSchoolCumulative?.student_grade_cumulative_id === currentData?.student_grade_cumulative_id ? selectedSchoolCumulative : currentData;
      }
      else {
        currentData = { ...selectedSchoolCumulative }
      }

      const isNew = currentData?.student_grade_cumulative_id ? false : true;


      let updatedGrades = removeKeysFromArrayObjects(studentGrades[key] || [], [
        'date_created',
        'date_updated',
        'student_grades_id',
        'selected_class_type',
        'grade_type'
      ]);

      updatedGrades = updatedGrades.map(item => {
        return {
          ...item,
          grade_quarter_1: parseInt(item?.grade_quarter_1 || 0),
          grade_quarter_2: parseInt(item?.grade_quarter_2 || 0),
          grade_quarter_3: parseInt(item?.grade_quarter_3 || 0),
          grade_quarter_4: parseInt(item?.grade_quarter_4 || 0),
          help_q1: item?.help_q1 && item?.help_q1 !== 'No' ? 'Yes' : '',
          help_q2: item?.help_q2 && item?.help_q2 !== 'No' ? 'Yes' : '',
          help_q3: item?.help_q3 && item?.help_q3 !== 'No' ? 'Yes' : '',
          help_q4: item?.help_q4 && item?.help_q4 !== 'No' ? 'Yes' : ''

        }
      })

      return {

        ...(isNew ? defaultCumulative : {}),
        ...currentData,
        app_group_id: currentChildDetails?.app_grp_id,
        student_grade_cumulative_id: currentData?.student_grade_cumulative_id || null,
        year_level: currentData?.year_level,
        child_id: currentChildDetails?.ch_id,
        grades: updatedGrades || [],
        gpa_final: parseFloat(`${currentData?.gpa_final || 0}.${currentData?.sub_gpa_final || 0}`),
        gpa_sem_2: parseFloat(`${currentData?.gpa_sem_2 || 0}.${currentData?.sub_gpa_sem_2 || 0}`)

      }
    });

    updatedStudentCumulative = removeKeysFromArrayObjects(updatedStudentCumulative || [], [
      'class_teacher',
      'date_added',
      'date_updated',
      'sub_gpa_final',
      'sub_gpa_sem_2',
    ]);

    dispatch(requestAddUpdateStudentCumulative(updatedStudentCumulative));

    setTimeout(() => {
      handleFindUser();
    }, 2000);
  }

  const handleSchoolYearChange = e => {
    const schoolYear = e.target.value.split('-');

    if (schoolYear.length > 0) {

      const startYear = new Date(`${schoolYear[0]}-08-30`);
      const endYear = new Date(`${schoolYear[1]}-06-30`);;

      const currentCumulative = studentCumulative.find(item => {
        const yearStart = item.school_year_start && item.school_year_start.split('-')[0];
        return (schoolYear[0] === yearStart) && (item.year_level === selectedGradeLevel)
      });

      if (currentCumulative && currentCumulative?.year_level) {
        setSelectedStudentGrades([...(studentGrades[currentCumulative?.year_level] || [])])
        setSelectedSchoolGrade(currentCumulative?.year_level);
        setSelectedSchoolCumulative(currentCumulative || null);
      }
      else {
        setSelectedSchoolGrade(null);
        setSelectedStudentGrades([]);
      }

      setSelectedSchoolCumulative({
        ...selectedSchoolCumulative,
        school_year_start: startYear.toISOString(),
        school_year_end: endYear.toISOString()
      })
    }


    setSelectedSchoolYear(e.target.value);
  }

  return (
    <div> {gradeLoading ? <Loading /> :
      <UserGradeStyled
        theme={theme}
        data-testid="user-grade-form"
        method="POST">

        <div className="gradeInfo">
          <div className="gradeForms">
            <div style={{ padding: 12 }}>

              <div>
                <h2>Student Grades</h2>
              </div>

              <div style={style.danger}>
                {userMessage}
              </div>

              {studentGradeLabels && <div style={{ marginTop: 12, marginBottom: 12 }}>
                Currently, this student has grade records for the following levels: {studentGradeLabels}.
              </div>}



              <div>
                <div style={style.label}>Child ID</div>
                <input
                  type="text"
                  value={currentChild?.childId}
                  id="childId"
                  name="childId"
                  placeholder=""
                  onChange={({ target }) => {
                    handleInputChange("childId", target.value);
                  }}
                  ref={register({ required: true })}
                />
              </div>
              <div>
                <div style={style.label}>Student Name</div>
                <input
                  disabled={true}
                  type="text"
                  value={`${currentChildDetails?.firstname || ''} ${currentChildDetails?.lastname || ''}`}
                  id="student_name"
                  name="student_name"
                  placeholder=""
                />
              </div>

              <div>
                <div style={style.label}>School Grade</div>
                <select
                  name="school_grade"
                  className="form-control"
                  onChange={handleSchoolGradeChange}
                >
                  {GRADE_OPTIONS.map(item => <option value={item.value}>{item.label}</option>)}
                </select>
              </div>


              <div>
                <div style={style.label}>School Year</div>
                <select
                  name="school_year"
                  className="form-control"
                  onChange={handleSchoolYearChange}
                  selected={selectedSchoolYear}
                >
                  <option value="">Please Select</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                  <option value="2021-2022">2021-2022</option>
                  <option value="2020-2021">2020-2021</option>
                </select>
              </div>

              <div>
                <div style={style.label}>Reporting Period</div>
                <select
                  selected={selectedReportingPeriod}
                  name="reporting_period"
                  className="form-control"
                  onChange={(e) => {
                    setSelectedReportingPeriod(e.target.value);
                  }}
                >
                  <option value={null}>Please select an option</option>
                  {REPORTING_PERIOD_OPTIONS.map(item => {
                    return <option value={item.value}>{item.label}</option>
                  })}
                </select>
              </div>
              <div>
                <div style={style.label}>GPA Weighted</div>
                {/* <input
                  value={selectedSchoolCumulative?.gpa_final}
                  onChange={handleCumulativeInputChange}
                  type="number"
                  id="gpa_weighted"
                  name="gpa_final"
                  placeholder=""
                  step={0.1}
                  max={5.0}
                /> */}

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <select
                    name="gpa_final"
                    className="form-control"
                    onChange={handleCumulativeInputChange}
                    value={selectedSchoolCumulative?.gpa_final || null}

                  >
                    {GPA_OPTIONS.map(item => {
                      return <option value={item.value}>{item.label}</option>
                    })}
                  </select>

                  {selectedSchoolCumulative?.gpa_final !== null && selectedSchoolCumulative?.gpa_final !== undefined && <select

                    name="sub_gpa_final"
                    className="form-control"
                    onChange={handleCumulativeInputChange}
                    value={selectedSchoolCumulative?.sub_gpa_final}
                  >
                    {SUB_GPA_OPTIONS.map(item => {
                      return <option value={item.value}>{item.label}</option>
                    })}
                  </select>}


                </div>
              </div>
              <div>
                <div style={style.label}>GPA Unweighted</div>
                {/* <input
                  value={selectedSchoolCumulative?.gpa_sem_2}
                  onChange={handleCumulativeInputChange}
                  type="number"
                  id="gpa_unweighted"
                  name="gpa_sem_2"
                  placeholder=""
                  step={0.1}
                  max={4.0}
                /> */}

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <select

                    name="gpa_sem_2"
                    className="form-control"
                    onChange={handleCumulativeInputChange}
                    value={selectedSchoolCumulative?.gpa_sem_2 || null}
                  >
                    {GPA_OPTIONS.map(item => {
                      return <option value={item.value}>{item.label}</option>
                    })}
                  </select>


                  {selectedSchoolCumulative?.gpa_sem_2 !== null && selectedSchoolCumulative?.gpa_sem_2 !== undefined && <select
                    disabled={selectedSchoolCumulative?.gpa_sem_2 === null}
                    name="sub_gpa_sem_2"
                    className="form-control"
                    onChange={handleCumulativeInputChange}
                    value={selectedSchoolCumulative?.sub_gpa_sem_2 || null}
                  >

                    {SUB_GPA_OPTIONS.map(item => {
                      return <option value={item.value}>{item.label}</option>
                    })}
                  </select>}

                </div>
              </div>

              <button disabled={isFindingUser} onClick={handleFindUser} type="button" >
                {isFindingUser ? 'Please Wait...' : 'Find Student'}
              </button>

            </div>

          </div>
          <div className="gradeForms">
            <div style={{ padding: 24 }}>
              <div className="qrCodeContainer">
                {qrCode && <div>
                  <img src={qrCode} style={{ width: 175, height: 175, textAlign: 'center' }} />
                  <div>QR Code for this page</div>
                </div>}
              </div>
              <br />
              <br />
              {studentGrades[selectedSchoolGrade] && studentGrades[selectedSchoolGrade].map((studentGrade, index) => {
                const isClassInOption = CLASS_TYPE.find(item => item.value === studentGrade?.class);

                if (!studentGrade?.selected_class_type) {
                  studentGrade.selected_class_type = isClassInOption ? 'option' : 'custom';
                }


                return <div style={{ paddingBottom: 12, paddingTop: 12 }}>
                  <div>
                    <div style={style.label}>Class Type</div>
                    <select
                      name="selected_class_type" id="selected_class_type"
                      value={studentGrade?.selected_class_type} onChange={handleGradeInputChange(index)}>
                      <option value="option">Select from option</option>
                      <option value="custom">Input custom class type</option>
                    </select>

                    {!studentGrade?.selected_class_type || studentGrade?.selected_class_type === 'option' ? <select

                      name="class" id="class"
                      value={studentGrade?.class} onChange={handleGradeInputChange(index)}>
                      <option value="">Select an option</option>
                      {CLASS_TYPE.map(item =>
                        <option value={item.value}>{item.label}</option>
                      )}
                    </select> : <input
                      // disabled={studentGrade?.class}
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade?.class}
                      type="text"
                      id="class"
                      name="class"
                      placeholder="Enter a custom option"
                    />}


                  </div>

                  <div>
                    <div style={style.label}>Class Name</div>
                    <input
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade?.subject}
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder=""
                    />
                  </div>



                  <div>
                    <div style={style.label}>Class Grade {currentReportingPeriod?.label && `${currentReportingPeriod?.label}`}</div>

                    {/* <select
                      name="grade_type" id="grade_type"
                      value={studentGrade?.grade_type} onChange={handleGradeInputChange(index)}>
                      <option value="number">Number</option>
                      <option value="letter">Letter</option>
                    </select>
 */}

                    <input
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade[selectedReportingPeriod]}
                      type="text"
                      id="final_grade"
                      // name={selectedReportingPeriod || 'final_grade'}
                      name={selectedReportingPeriod}
                      // name={studentGrade?.grade_type === 'letter' ? 'text' : 'number'}
                      placeholder=""
                    />
                    <div style={style.label}>Letter Class Grade {currentReportingPeriod?.label && `${currentReportingPeriod?.label}`}</div>
                    <input
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade[`letter_${selectedReportingPeriod}`]}
                      type="text"
                      id="letter_final_grade"
                      // name={selectedReportingPeriod || 'final_grade'}
                      name={`letter_${selectedReportingPeriod}`}
                      // name={studentGrade?.grade_type === 'letter' ? 'text' : 'number'}
                      placeholder=""
                    />

                  </div>

                  {selectedSchoolGrade >= 7 && <div>
                    <div style={style.label}>Class Designation</div>
                    <input
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade?.designation}
                      type="text"
                      id="designation"
                      name="designation"
                      placeholder=""
                    />
                  </div>}


                  {selectedReportingPeriod && !selectedReportingPeriod.includes('mid_') && !selectedReportingPeriod.includes('final_') && <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span style={style.label}>Request Assistance</span>
                    <input
                      onChange={handleGradeInputChange(index)}
                      checked={!studentGrade[QUARTER_PERIOD[selectedReportingPeriod]] || studentGrade[QUARTER_PERIOD[selectedReportingPeriod]] === 'No' ? false : studentGrade[QUARTER_PERIOD[selectedReportingPeriod]]}
                      type="checkbox"
                      id="help_needed"
                      name={`${QUARTER_PERIOD[selectedReportingPeriod]}`}
                      placeholder=""
                      style={{ width: 25, marginTop: 2 }}
                    />
                  </div>}

                  <br />



                </div>
              })}



              <div style={{ width: '100%' }}>
                <button disabled={selectedSchoolYear ? false : true} onClick={handleAddClass} type="button" >
                  Add More Class
                </button>
                {studentGrades[selectedSchoolGrade] && studentGrades[selectedSchoolGrade].length > 0 && <button
                  //  disabled={studentGrades[selectedSchoolGrade] && studentGrades[selectedSchoolGrade].length === 0}
                  onClick={handleReview}
                  type="button"
                >
                  Review
                </button>}

              </div>
            </div>
          </div>
        </div>
      </UserGradeStyled>
    }

      <Confirmation
        isVisible={isConfirmationVisible}
        message="Do you want to save these changes? Saving will overwrite the student's existing grade records."
        toggleConfirmationVisible={setIsConfirmationVisible}
        onSubmit={() => {
          handleSaveGrades();
        }}
        submitButtonLabel="Submit"
      />
    </div>
  );
}


const style = {
  danger: {
    color: 'red',
    marginTop: 12,
    marginBottom: 12
  },
  label: {
    fontWeight: 'bold'
  },
  success: {
    color: 'green',
    marginTop: 12,
    marginBottom: 12
  }
}
