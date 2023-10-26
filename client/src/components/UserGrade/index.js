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

// const CLASS_TYPE = [
//   { value: 'Math', label: 'Math' },
//   { value: 'English', label: 'English' },
//   { value: 'Science', label: 'Science' },

// ]

const REPORTING_PERIOD_OPTIONS = [
  { value: 'grade_quarter_1', label: 'Q1 (Semester 1)' },
  { value: 'grade_quarter_2', label: 'Q2 (Semester 1)' },
  { value: 'mid_final_grade', label: 'Semester 1 Final' },
  { value: 'grade_quarter_3', label: 'Q3 (Semester 2)' },
  { value: 'grade_quarter_4', label: 'Q4 (Semester 2)' },
  { value: 'final_grade', label: 'Semester 2 Final' },
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



  svg {
    vertical-align: middle;
  }
  #socials {
    margin-top: 2em !important;
  }
  #socials button {
    padding: 1em;
    border-radius: 0 !important;
    margin: 5px;
  }
  #facebook {
    background-color: ${({ theme }) => theme.button.backgroundColor.secondary};
  }
  #google {
    background-color: ${({ theme }) => theme.button.backgroundColor.error};
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
    }
  }
`;

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
    childId: "",
  });

  const [qrCode, setQrCode] = useState('');

  const [currentChildDetails, setCurrentChildDetails] = useState(null);
  const [isFindingUser, setIsFindingUser] = useState(false);
  // const [attendanceMessage, setAttendanceMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [studentCumulative, setStudentCumulative] = useState([]);
  const [studentGrades, setStudentGrades] = useState({});

  const [selectedSchoolGrade, setSelectedSchoolGrade] = useState(null);
  const [selectedReportingPeriod, setSelectedReportingPeriod] = useState('grade_quarter_1');
  const [selectedSchoolCumulative, setSelectedSchoolCumulative] = useState(null);
  const [selectedStudentGrades, setSelectedStudentGrades] = useState([{ ...classType }]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(null);

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const currentReportingPeriod = REPORTING_PERIOD_OPTIONS.find(item => item.value === selectedReportingPeriod);

  const studentGradeLabels = Object.keys(studentGrades).map(key => {
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
      setUserMessage('');
      setIsFindingUser(true);
      const response = await getCurrentUserAndGrades({
        ...currentChild
      });

      if (response?.child) {
        const appGroups = response?.app_groups || [];
        setStudentGrades({ ...(response.grades || {}) });
        setStudentCumulative([...(response?.grade_cumulative || [])]);


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
    if (name === 'gpa_final' || name === 'gpa_sem_2') {
      let parsedValue = parseFloat(value);

      if ((name === 'gpa_final' && parsedValue > 4) || (name === 'gpa_sem_2' && parsedValue > 5)) {
        return;
      }
      else {
        setSelectedSchoolCumulative({
          ...selectedSchoolCumulative,
          [name]: parsedValue
        });
      }
    }

  };


  const handleGradeInputChange = index => e => {
    const { name, value } = e.target;

    const updatedStudentGrades = [...(studentGrades[selectedSchoolGrade] || [])];

    // const isGradeField = (name !== 'class') && (name !== 'subject') && (name !== 'designation');

    if (index > -1) {
      updatedStudentGrades[index] = {
        ...(studentGrades[selectedSchoolGrade][index] || {}),
        [name]: value
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

    setSelectedStudentGrades([...(studentGrades[currentGradeLevel] || [])])
    setSelectedSchoolGrade(currentGradeLevel);
    setSelectedSchoolCumulative(currentCumulative || null);
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

    if (studentGrades && studentCumulative.length) {
      let updatedStudentCumulative = Object.keys(studentGrades).map(key => {

        let currentData = studentCumulative.find(item => item.year_level === parseInt(key));

        currentData = currentData && selectedSchoolCumulative && selectedSchoolCumulative?.student_grade_cumulative_id === currentData?.student_grade_cumulative_id ? selectedSchoolCumulative : currentData;
        const isNew = currentData?.student_grade_cumulative_id ? false : true;

        let updatedGrades = removeKeysFromArrayObjects(studentGrades[key] || [], [
          'date_created',
          'date_updated',
          'student_grades_id'
        ]);

        updatedGrades = updatedGrades.map(item => {
          return {
            ...item,
            grade_quarter_1: parseInt(item.grade_quarter_1),
            grade_quarter_2: parseInt(item.grade_quarter_2),
            grade_quarter_3: parseInt(item.grade_quarter_3),
            grade_quarter_4: parseInt(item.grade_quarter_4)

          }
        })

        return {
          ...currentData,
          ...(isNew ? defaultCumulative : {}),
          app_group_id: currentChildDetails?.app_grp_id,
          student_grade_cumulative_id: currentData?.student_grade_cumulative_id || null,
          year_level: parseInt(key),
          child_id: currentChildDetails?.ch_id,
          grades: updatedGrades || []

        }
      });

      updatedStudentCumulative = removeKeysFromArrayObjects(updatedStudentCumulative || [], [
        'class_teacher',
        'date_added',
        'date_updated'
      ]);


      console.log('updatedStudentCumulative', updatedStudentCumulative)
      dispatch(requestAddUpdateStudentCumulative(updatedStudentCumulative));
    }

  }

  const handleSchoolYearChange = e => {
    const schoolYear = e.target.value.split('-');

    if (schoolYear.length > 0) {

      const startYear = new Date(`${schoolYear[0]}-08-30`);
      const endYear = new Date(`${schoolYear[1]}-06-30`);;

      const currentCumulative = studentCumulative.find(item => {
        const yearStart = item.school_year_start && item.school_year_start.split('-')[0];
        return schoolYear[0] === yearStart
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

      setSelectedSchoolYear(e.target.value);
      setSelectedSchoolCumulative({
        ...selectedSchoolCumulative,
        school_year_start: startYear.toISOString(),
        school_year_end: endYear.toISOString()
      })
    }
  }

  return (
    <div> {gradeLoading ? <Loading /> :
      <UserGradeStyled
        theme={theme}
        data-testid="user-grade-form"
        method="POST">



        <div className="gradeInfo">
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', width: 500 }}>
            <div style={{ padding: 24 }}>

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
                <input
                  value={selectedSchoolCumulative?.gpa_final}
                  onChange={handleCumulativeInputChange}
                  type="number"
                  id="gpa_weighted"
                  name="gpa_final"
                  placeholder=""
                  step={0.1}
                  max={5.0}
                />
              </div>
              <div>
                <div style={style.label}>GPA Unweighted</div>
                <input
                  value={selectedSchoolCumulative?.gpa_sem_2}
                  onChange={handleCumulativeInputChange}
                  type="number"
                  id="gpa_unweighted"
                  name="gpa_sem_2"
                  placeholder=""
                  step={0.1}
                  max={4.0}
                />
              </div>

              <button disabled={isFindingUser} onClick={handleFindUser} type="button" >
                {isFindingUser ? 'Please Wait...' : 'Find Student'}
              </button>

            </div>

          </div>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', width: 500 }}>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {qrCode && <div>
                  <img src={qrCode} style={{ width: 175, height: 175, textAlign: 'center' }} />
                  <div>QR Code for this page</div>
                </div>}
              </div>
              <br />
              <br />
              {studentGrades[selectedSchoolGrade] && studentGrades[selectedSchoolGrade].map((studentGrade, index) => {
                return <div style={{ paddingBottom: 12, paddingTop: 12 }}>
                  <div>
                    <div style={style.label}>Class Type</div>
                    <input
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade?.class}
                      type="text"
                      id="class"
                      name="class"
                      placeholder=""
                    />
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
                    <input
                      onChange={handleGradeInputChange(index)}
                      value={studentGrade[selectedReportingPeriod]}
                      type="text"
                      id="final_grade"
                      name={selectedReportingPeriod || 'final_grade'}
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

        <Confirmation
          isVisible={isConfirmationVisible}
          message="Do you want to save these changes? Saving will overwrite the student's existing grade records."
          toggleConfirmationVisible={setIsConfirmationVisible}
          onSubmit={() => {
            handleSaveGrades();
          }}
          submitButtonLabel="Submit"
        />
      </UserGradeStyled>
    }</div>
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
