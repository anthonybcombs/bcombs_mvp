export const Items = {
  standard: {
    singleLineText: 'singleLineText',
    numbers: 'numbers',
    paragraphText: 'paragraphText',
    // checkboxes: 'checkboxes',
    multipleChoice: 'multipleChoice',
    dropDown: 'dropDown',
    matrix: 'matrix',
    radioButton: 'radioButton',
    linearScale: 'linearScale',
    slider: 'slider',
    // checkboxGrid: 'checkboxGrid',
    ranking: 'ranking',
    file: 'file',
    sectionBreak: 'sectionBreak',
    pageBreak: 'pageBreak',
  },
  prime: {
    name: 'name',
    primeFile: 'primeFile',
    address: 'address',
    rating: 'rating',
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
    allowAddField: true,
    includeLogic: false,
    includeValidation: true
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
    allowAddField: true,
    includeLogic: false,
    includeValidation: true,
  },
  // {
  //   fields: [
  //     {
  //       type: 'checkboxes',
  //       tag: 'checkboxes',
  //       options: [
  //         { name: 'option1', label: 'Option 1', tag: 'checkbox' },
  //         { name: 'option2', label: 'Option 2', tag: 'checkbox' },
  //         { name: 'option3', label: 'Option 3', tag: 'checkbox' }
  //       ]
  //     }
  //   ],
  //   displayLabel: 'Checkboxes',
  //   label: 'Checkboxes question',
  //   type: 'checkboxes',
  //   gridMax: 1,
  //   isQA: true,
  //   includeValidation: true
  // },
  {
    fields: [
      {
        type: 'multipleChoice',
        tag: 'multipleChoice',
        options: [
          { name: 'option1', label: 'Option 1', tag: 'radio' },
          { name: 'option2', label: 'Option 2', tag: 'radio' },
          { name: 'option3', label: 'Option 3', tag: 'radio' }
        ],
        column: '1',
        isMultiple: false, // Added nov 11
      }
    ],
    displayLabel: 'Multiple Choice',
    label: 'Multiple Choice question',
    type: 'multipleChoice',
    gridMax: 1,
    supportMultiple: true, // Added nov 11
    isQA: true
  },
  {
    fields: [
      {
        type: 'dropdown',
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
        tag: 'matrix',
        isMultiple: false, // Added nov 11
        rows: [
          {
            row: 'Row 1'
          },
          {
            row: 'Row 2'
          },
          {
            row: 'Row 3'
          }
        ],
        columns: [
          {
            label: 'Column 1',
            value: 1
          },
          {
            label: 'Column 2',
            value: 2
          },
        ]
      }
    ],
    displayLabel: 'Matrix / Rating',
    label: 'Matrix / Rating question',
    type: 'matrix',
    gridMax: 1,
    isQa: true,
    supportMultiple: true, // Added nov 11
    includeLogic: false,
  },
  // {
  //   fields: [
  //     { label: 'Radio Button', tag: 'radio', column: '1'}
  //   ],
  //   label: 'Radio Button',
  //   type: 'radioButton'
  // },
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
    gridMax: 2,
    isQa: true,
    includeLogic: false
  },
  // {
  //   fields: [
  //     {
  //       label: 'Checkbox Grid',
  //       tag: 'checkboxGrid',
  //       rows: [
  //         {
  //           row: 'Row 1'
  //         },
  //         {
  //           row: 'Row 2'
  //         }
  //       ],
  //       columns: [
  //         {
  //           label: 'Column 1',
  //           value: 1
  //         },
  //         {
  //           label: 'Column 2',
  //           value: 2
  //         }
  //       ]
  //     }
  //   ],
  //   displayLabel: 'Checkbox Grid',
  //   label: 'Checkbox grid question',
  //   type: 'checkboxGrid',
  //   gridMax: 1,
  //   isQa: true,
  //   includeLogic: false,
  // },
  {
    fields: [
      {
        label: 'Ranking',
        tag: 'ranking',
        items: [
          { label: '', rank: 1 },
          { label: '', rank: 2 },
          { label: '', rank: 3 } 
        ],
        column: '1'
      }
    ],
    displayLabel: 'Ranking',
    label: 'Ranking question',
    type: 'ranking',
    gridMax: 1,
    isQa: true,
    includeLogic: false,
  },
  {
    fields: [
      {
        label: 'File Upload',
        tag: 'file',
        limit: 5,
        errorMessage: 'Only PDF, PNG, JPG, JPEG, DOC, DOCX, GIF files are supported.',
        allowTypes: [
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
    includeLogic: false,
    gridMax: 1,
    isQA: true
  },
  {
    fields: [
      { label: 'Section Break', description: '', tag: 'sectionBreak' }
    ],
    label: 'Section Break',
    type: 'sectionBreak',
    hasSettings: false,
    gridMax: 1,
  },
  {
    fields: [
      { label: 'Page Break', description: '', tag: 'pageBreak'}
    ],
    label: 'Page Break',
    type: 'pageBreak',
    hasSettings: false,
    gridMax: 1,
  }
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
        fixedWidth: true,
        requireAddOption: true,
        options: [
          { name: 'mr', label: 'Mr.', tag: 'checkbox' },
          { name: 'mrs', label: 'Mrs.', tag: 'checkbox' },
          { name: 'ms', label: 'Ms.', tag: 'checkbox' },
        ]
      },
      { label: 'First Name', type: 'text', tag: 'input', placeholder: 'First Name', column: '1'},
      { label: 'Middle Name', type: 'text', tag: 'input', placeholder: 'Middle Name', column: '1'},
      { label: 'Last Name', type: 'text', tag: 'input', placeholder: 'Last Name', column: '1'}
    ],
    label: 'Name',
    type: 'name',
    gridMax: 4,
    isQA: true,
    includeLogic: false
  },
  {
    fields: [
      {
        label: 'File Upload',
        tag: 'file',
        limit: 5,
        errorMessage: 'Only PDF, PNG, JPG, JPEG, DOC, DOCX, GIF files are supported.',
        allowTypes: [
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
    type: 'primeFile',
    includeLogic: false,
    gridMax: 1,
    isQA: true
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
    gridMax: 4,
    includeLogic: false
  },
  {
    fields: [
      {
        label: 'Rating',
        tag: 'rating',
        scale: { max: 5 },
        items: [
          { label: '', rank: 1 },
          { label: '', rank: 2 },
          { label: '', rank: 3 },
          { label: '', rank: 4 },
          { label: '', rank: 5 }
        ]
      }
    ],
    displayLabel: 'Rating',
    label: 'Rating question',
    type: 'rating',
    gridMax: 1,
    isQa: true,
    includeLogic: false,
  },
  {
    fields: [
      {
        label: 'Type',
        type: 'type',
        tag: 'select',
        placeholder: 'Type',
        requireAddOption: true,
        options: [
          { name: 'Personal', label: 'Personal' },
          { name: 'Work', label: 'Work' },
        ]
      },
      { label: 'Email', type: 'email', tag: 'input', placeholder: 'sample@email.com' },
    ],
    label: 'Email',
    type: 'email',
    allowAddField: false,
    isQa: true,
    includeLogic: false,
  },
  {
    fields: [
      { label: 'MM', type: 'text', tag: 'input', placeholder: 'MM' },
      { label: 'DD', type: 'text', tag: 'input', placeholder: 'DD' },
      { label: 'YYYY', type: 'text', tag: 'input', placeholder: 'YYYY' },
      { label: '', type: 'date', tag: 'icon', placeholder: 'date' }
    ],
    label: 'Date',
    type: 'date',
    includeLogic: false
  },
  {
    fields: [
      {
        label: 'Type',
        type: 'type',
        tag: 'select',
        placeholder: 'Type',
        requireAddOption: true,
        options: [
          { name: 'Cell', label: 'Cell' },
          { name: 'Home', label: 'Home' },
          { name: 'Work', label: 'Work' },
        ]
      },
      { label: 'Phone', type: 'text', tag: 'input', placeholder: '###-###-####' }
    ],
    label: 'Phone',
    type: 'phone',
    allowAddField: false,
    isQa: true,
    includeLogic: false,
  },
  {
    fields: [
      { label: 'Time', type: 'text', tag: 'input', placeholder: 'Time' },
      { label: '', type: 'time', tag: 'icon', placeholder: 'time' }
    ],
    label: 'Time',
    type: 'time',
    includeLogic: false
  },
  {
    fields: [
      { label: '', type: 'currency', tag: 'icon', placeholder: 'currency' },
      { label: 'Price', type: 'number', tag: 'input', placeholder: 'Price' }
    ],
    label: 'Price',
    type: 'price',
    includeLogic: false
  },
  {
    fields: [
      { label: 'Website', type: 'text', tag: 'input', placeholder: 'Website', column: '1'},
    ],
    label: 'Website',
    type: 'website',
    includeLogic: false
  },
]
