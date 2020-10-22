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
      { label: 'Single Line Text', type: 'text', tag: 'input', placeholder: 'Single LIne Text', column: '1'}
    ],
    label: 'Single Line Text',
    type: 'singleLineText',
    canBeGrouped: true
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
    canBeGrouped: true
  },
  {
    fields: [
      { label: 'Question', type: 'text', tag: 'input', placeholder: 'Question', column: '1'},
      {
        type: 'group',
        options: [
          { name: 'option1', label: 'Option 1', tag: 'checkbox' },
          { name: 'option2', label: 'Option 2', tag: 'checkbox' },
          { name: 'option3', label: 'Option 3', tag: 'checkbox' }
        ]
      }
    ],
    label: 'Checkboxes',
    type: 'checkboxes',
    isQA: true
  },
  {
    fields: [
      { label: 'Multiple Choice', tag: 'multipleChoice', multiple: false, column: '1'}
    ],
    label: 'Multiple Choice',
    type: 'multipleChoice'
  },
  {
    fields: [
      { label: 'Dropdown', type: 'text', tag: 'select', placeholder: 'Dropdown', column: '1'}
    ],
    label: 'Dropdown',
    type: 'dropDown',
    canBeGrouped: true
  },
  {
    fields: [
      { label: 'Matrix / Rating', tag: 'rating', column: '1'}
    ],
    label: 'Matrix / Rating',
    type: 'rating'
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
      { label: 'Linear Scale', tag: 'linear', column: '1'}
    ],
    label: 'Linear Scale',
    type: 'linearScale'
  },
  {
    fields: [
      { label: 'Slider', tag: 'slider', column: '1'}
    ],
    label: 'Slider',
    type: 'slider'
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
      { label: 'Ranking', tag: 'ranking', column: '1'}
    ],
    label: 'Ranking',
    type: 'ranking'
  },
  {
    fields: [
      { label: 'File Upload', tag: 'file', column: '1'}
    ],
    label: 'File Upload',
    type: 'file'
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
      { label: 'First Name', type: 'text', tag: 'input', placeholder: 'First Name', column: '1'},
      { label: 'Middle Name', type: 'text', tag: 'input', placeholder: 'Middle Name', column: '1'},
      { label: 'Last Name', type: 'text', tag: 'input', placeholder: 'Last Name', column: '1'}
    ],
    label: 'Name',
    type: 'name'
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
    type: 'address'
  },
  {
    fields: [
      { label: 'Rating', tag: 'rating', column: '1'}
    ],
    label: 'Rating',
    type: 'primeRating'
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
