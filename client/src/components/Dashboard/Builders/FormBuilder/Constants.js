export const Items = {
  standard: {
    singleLineText: 'singleLineText',
    numbers: 'numbers',
    paragraphText: 'paragraphText',
    checkboxes: 'checkboxes',
    multipleChoice: 'multipleChoice',
    dropDown: 'dropDown',
    rating: 'rating',
    radioButton: 'radioButton',
    linearScale: 'linearScale',
    slider: 'slider',
    checkboxGrid: 'checkboxGrid',
    ranking: 'ranking',
    file: 'file',
    sectionBreak: 'sectionBreak',
    pageBreak: 'pageBreak',
  },
  prime: {
    name: 'name',
    primeFile: 'primeFile',
    address: 'address',
    primeRating: 'primeRating',
    email: 'email',
    date: 'date',
    phone: 'phone',
    time: 'time',
    price: 'price',
    website: 'website'
  }
}


export const StandardFields = [
  {
    fields: [
      { label: 'Single Line Text', type: 'text', tag: 'input', placeholder: 'Single Line Text', column: '1'}
    ],
    label: 'Single Line Text',
    type: 'singleLineText',
    canBeGrouped: true,
    allowAddField: true
  },
  // {
  //   fields: [
  //     { label: 'Numbers', type: 'number', tag: 'input', placeholder: 'Numbers', column: '1'}
  //   ],
  //   label: 'Numbers',
  //   type: 'numbers',
  //   canBeGrouped: true
  // },
  {
    fields: [
      { label: 'Paragraph Text', type: 'text', tag: 'textarea', placeholder: 'Paragraph Text', column: '1'}
    ],
    label: 'Paragraph Text',
    type: 'paragraphText',
    canBeGrouped: true,
    allowAddField: true
  },
  {
    fields: [
      {
        type: 'option',
        tag: 'checkboxes',
        options: [
          { name: 'option1', label: 'Option 1', tag: 'checkbox' },
          { name: 'option2', label: 'Option 2', tag: 'checkbox' },
          { name: 'option3', label: 'Option 3', tag: 'checkbox' }
        ],
        column: '1'
      }
    ],
    displayLabel: 'Checkboxes',
    label: 'Checkboxes question',
    type: 'checkboxes',
    gridMax: 1,
    isQA: true
  },
  {
    fields: [
      {
        type: 'option',
        tag: 'radios',
        options: [
          { name: 'option1', label: 'Option 1', tag: 'radio' },
          { name: 'option2', label: 'Option 2', tag: 'radio' },
          { name: 'option3', label: 'Option 3', tag: 'radio' }
        ],
        column: '1'
      }
    ],
    displayLabel: 'Multiple Choice',
    label: 'Multiple Choice question',
    type: 'multipleChoice',
    gridMax: 1,
    isQA: true
  },
  {
    fields: [
      {
        type: 'option',
        tag: 'dropdown',
        options: [
          { name: 'option1', label: 'Option 1', tag: 'dropdown' },
          { name: 'option2', label: 'Option 2', tag: 'dropdown' },
          { name: 'option3', label: 'Option 3', tag: 'dropdown' }
        ],
        column: '1'
      }
    ],
    displayLabel: 'Dropdown',
    label: 'Dropdown question',
    type: 'dropDown',
    gridMax: 1,
    isQA: true
  },
  {
    fields: [
      {
        label: 'Matrix / Rating',
        tag: 'rating',
        choices: [
          {
            statement: 'Statement 1',
            answers: []
          },
          {
            statement: 'Statement 2',
            answers: []
          }
        ],
        scales: [
          {
            label: 'Strongly Agree',
            value: 1
          },
          {
            label: 'Agree',
            value: 2
          },
          {
            label: 'Undecided',
            value: 3
          },
          {
            label: 'Disagree',
            value: 4
          },
          {
            label: 'Strongly Disagree',
            value: 5
          }
        ],
        isMultiple: false,
        position: 'vertical',
      }
    ],
    displayLabel: 'Matrix / Rating',
    label: 'Matrix / Rating question',
    type: 'rating',
    isQa: true
  },
  {
    fields: [
      { label: 'Radio Button', tag: 'radio', column: '1'}
    ],
    label: 'Radio Button',
    type: 'radioButton'
  },
  {
    fields: [
      {
        label: 'Linear Scale',
        tag: 'linear',
        min: { value: 1, label: '' },
        max: { value: 10, label: '' },
      },
    ],
    displayLabel: 'Linear Scale',
    label: 'Linear scale question',
    type: 'linearScale',
    gridMax: 2,
    isQa: true
  },
  {
    fields: [
      {
        label: 'Slider',
        tag: 'slider',
        scale: { min: 0, max: 100 },
        scaleLabels: { left: '0', center: '', right: '100' }
      }
    ],
    displayLabel: 'Slider',
    label: 'Slider question',
    type: 'slider',
    isQa: true
  },
  {
    fields: [
      { label: 'Checkbox Grid', tag: 'checkbox', isGrid: true, column: '1'}
    ],
    label: 'Checkbox Grid',
    type: 'checkboxGrid'
  },
  {
    fields: [
      {
        label: 'Ranking',
        tag: 'ranking',
        items: [
          { label: '', rank: '' },
          { label: '', rank: '' },
          { label: '', rank: '' } 
        ],
        column: '1'
      }
    ],
    displayLabel: 'Ranking',
    label: 'Ranking question',
    type: 'ranking',
    gridMax: 1,
    isQa: true
  },
  {
    fields: [
      {
        label: 'File Upload',
        tag: 'file',
        instruction: '',
        limit: 5,
        errorMessage: 'Only PDF, PNG, JPG, JPEG, DOC, DOCX, GIF files are supported.',
        allowedTypes: [
          { label: 'PDF', ext: ['.pdf'], selected: true },
          { label: 'PNG', ext: ['.png'], selected: true },
          { label: 'JPG, JPEG', ext: ['.jpg', '.jpeg'], selected: true },
          { label: 'DOC, DOCX', ext: ['.doc', '.docx'], selected: true },
          { label: 'GIF', ext: ['.gif'], selected: true }
        ]
      }
    ],
    displayLabel: 'File Upload',
    label: 'File upload question',
    type: 'file',
    isQA: true
  },
  {
    fields: [
      { label: 'Section Break', tag: 'sectionBreak', column: '1'}
    ],
    label: 'Section Break',
    type: 'sectionBreak'
  },
  {
    fields: [
      { label: 'Page Break', tag: 'pageBreak', column: '1'}
    ],
    label: 'Page Break',
    type: 'pageBreak'
  },
]

export const PrimeFields = [
  {
    fields: [
      {
        label: 'Title',
        type: 'title',
        tag: 'select',
        placeholder: 'Title',
        column: '1',
        options: [
          { name: 'mr', label: 'Mr.', tag: 'checkbox' },
          { name: 'mrs', label: 'Mrs.', tag: 'checkbox' },
        ]
      },
      { label: 'First Name', type: 'text', tag: 'input', placeholder: 'First Name', column: '1'},
      { label: 'Middle Name', type: 'text', tag: 'input', placeholder: 'Middle Name', column: '1'},
      { label: 'Last Name', type: 'text', tag: 'input', placeholder: 'Last Name', column: '1'}
    ],
    label: 'Name',
    type: 'name',
    gridMax: 4,
    isQA: true
  },
  {
    fields: [
      { label: 'File Upload', tag: 'file', column: '1'}
    ],
    label: 'File Upload',
    type: 'primeFile'
  },
  {
    fields: [
      { label: 'Street Address', type: 'text', tag: 'input', placeholder: 'Street Address', column: '4'},
      { label: 'Street Address Line 2', type: 'text', tag: 'input', placeholder: 'Street Address Line 2', column: '4'},
      { label: 'State / Province / Region', type: 'state', tag: 'select', placeholder: 'State / Province / Region', column: '2'},
      { label: 'City', type: 'text', tag: 'input', placeholder: 'City', column: '2'},
      { label: 'Postal / Zip Code', type: 'text', tag: 'input', placeholder: 'Postal / Zip Code', column: '2'},
      { label: 'Country', type: 'country', tag: 'select', placeholder: 'Country', column: '2', options: [] }
    ],
    label: 'Address',
    type: 'address',
    gridMax: 4
  },
  {
    fields: [
      { label: 'Rating', tag: 'rating', column: '1'}
    ],
    label: 'Rating',
    type: 'primeRating',
  },
  {
    fields: [
      { label: 'Email', type: 'email', tag: 'input', placeholder: 'Email', column: '1'},
    ],
    label: 'Email',
    type: 'email'
  },
  {
    fields: [
      { label: 'MM', type: 'text', tag: 'input', placeholder: 'MM', column: '1'},
      { label: 'DD', type: 'text', tag: 'input', placeholder: 'DD', column: '1'},
      { label: 'YYYY', type: 'text', tag: 'input', placeholder: 'YYYY', column: '1'},
    ],
    label: 'Date',
    type: 'date'
  },
  {
    fields: [
      { label: 'Mobile', type: 'number', tag: 'input', placeholder: 'Mobile', column: '1'},
      { label: 'Home', type: 'number', tag: 'input', placeholder: 'Home', column: '1'},
      { label: 'Business', type: 'number', tag: 'input', placeholder: 'Business', column: '1'},
    ],
    label: 'Phone',
    type: 'phone'
  },
  {
    fields: [
      { label: 'Time', type: 'text', tag: 'input', placeholder: 'Time', column: '1'},
    ],
    label: 'Time',
    type: 'time'
  },
  {
    fields: [
      { label: 'Price', type: 'text', tag: 'input', placeholder: 'Price', column: '1'},
    ],
    label: 'Price',
    type: 'price'
  },
  {
    fields: [
      { label: 'Website', type: 'text', tag: 'input', placeholder: 'Website', column: '1'},
    ],
    label: 'Website',
    type: 'website'
  },
]
