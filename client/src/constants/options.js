const OPTION_MALE_RELATIONSHIPS = [
  { label: "Father", value: "father" },
  { label: "Son", value: "son" },
  { label: "Brother", value: "brother" },
  { label: "Uncle", value: "uncle" },
  { label: "Cousin (Male)", value: "cousin_male" },
  { label: "Grandfather", value: "grandfather" },
  { label: "Grandson", value: "grandson" },
  { label: "Stepbrother", value: "stepbrother" },
  { label: "Stepfather", value: "stepfather" },
  { label: "Stepson", value: "stepson" },
  { label: "Brother-in-Law", value: "brother_in_law" },
  { label: "Father-in-Law", value: "father_in_law" },
  { label: "Son-in-Law", value: "son_in_law" },
  { label: "Other", value: "other" }
];

const OPTION_FEMALE_RELATIONSHIPS = [
  { label: "Mother", value: "mother" },
  { label: "Daughter", value: "daughter" },
  { label: "Sister", value: "sister" },
  { label: "Aunt", value: "aunt" },
  { label: "Cousin (Female)", value: "cousin_female" },
  { label: "Grandmother", value: "grandmother" },
  { label: "Stepsister", value: "stepsister" },
  { label: "Stepmother", value: "stepmother" },
  { label: "Stepdaughter", value: "stepdaughter" },
  { label: "Sister-in-Law", value: "sister_in_law" },
  { label: "Mother-in-Law", value: "mother_in_law" },
  { label: "Daughter-in-Law", value: "daughter_in_law" },
  { label: "Other", value: "other" }
];

const OPTION_CUSTOM_RELATIONSHIPS = [
  { id: 1, label: "Mother", value: "mother" },
  { id: 2, label: "Father", value: "father" },
  { id: 3, label: "Grandparent", value: "grandparent" },
  { id: 4, label: "Aunt / Uncle", value: "Aunt /Uncle" },
  { id: 5, label: "Sibling", value: "sibling" },
  { id: 6, label: "Other Relative", value: "Other Relative" },
  { id: 7, label: "Family Friend", value: "Family Friend" },
  { id: 8, label: "Other", value: "Other" }
];


const OPTION_SCHOOL_YEAR = [
  { id: 1, label: 2023, value: 2023 },
  { id: 2, label: 2022, value: 2022 },
  { id: 3, label: 2021, value: 2021 },
  { id: 4, label: 2020, value: 2020 },
  { id: 5, label: 2019, value: 2019 },
  
];




const getOptionTestName = (id = null) => {

  if(id === '668ac294-3b78-11ee-8a4a-c6be8a6b501e' /* Youth Literacy Program */ ||  /* stage */  id === '2965faab-4633-11ee-adb5-824b66c683b0') {
    return [
      { value: 'casas_reading', label: 'CASAS Reading (Score Range - 153-275)' }, 
      { value: 'casas_math', label: ' CASAS Math (Range - 192-240)' },
    ];
  }

  else if(id === '636f012d-3207-11ee-8a4a-c6be8a6b501e' /* Youth Literacy Program */ || /* stage */ id === 'e1ceb81c-4647-11ee-adb5-824b66c683b0') {
    return [
      { value: 'tabe_math', label: 'TABE Math (Range 1-50)' }, 
      { value: 'tabe_reading', label: 'TABE Reading (Range 1-25)' },

      { value: 'buckle_down', label: 'Buckle Down (Range 1-100)' }, 
      { value: 'common_core_reading', label: 'Common Core Reading (Range 1-60)' },
      { value: 'common_core_math', label: 'Common Core Math (Range 1-135)' },

    ]
  }
  
  return [
    { value: 'act', label: 'ACT' }, 
    { value: 'sat', label: 'SAT' }, 
    { value: 'eog', label: 'EOG' }
  ];
}


export {
  OPTION_FEMALE_RELATIONSHIPS,
  OPTION_MALE_RELATIONSHIPS,
  OPTION_CUSTOM_RELATIONSHIPS,
  OPTION_SCHOOL_YEAR,
  getOptionTestName
};
