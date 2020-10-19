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
      { label: 'Single Line Text', type: 'text', tag: 'input', placeholder: 'Single LIne Text' }
    ],
    label: 'Single Line Text',
    type: 'singleLineText',
    canBeGrouped: true
  },
  {
    fields: [
      { label: 'Numbers', type: 'number', tag: 'input', placeholder: 'Numbers' }
    ],
    label: 'Numbers',
    type: 'numbers',
    canBeGrouped: true
  },
  {
    fields: [
      { label: 'Paragraph Text', type: 'text', tag: 'textarea', placeholder: 'Paragraph Text' }
    ],
    label: 'Paragraph Text',
    type: 'paragraphText',
    canBeGrouped: true
  },
  {
    fields: [
      { label: 'Question', type: 'text', tag: 'input', placeholder: 'Question' },
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
      { label: 'Multiple Choice', tag: 'multipleChoice', multiple: false }
    ],
    label: 'Multiple Choice',
    type: 'multipleChoice'
  },
  {
    fields: [
      { label: 'Dropdown', type: 'text', tag: 'select', placeholder: 'Dropdown' }
    ],
    label: 'Dropdown',
    type: 'dropDown',
    canBeGrouped: true
  },
  {
    fields: [
      { label: 'Matrix / Rating', tag: 'rating' }
    ],
    label: 'Matrix / Rating',
    type: 'rating'
  },
  {
    fields: [
      { label: 'Radio Button', tag: 'radio' }
    ],
    label: 'Radio Button',
    type: 'radioButton'
  },
  {
    fields: [
      { label: 'Linear Scale', tag: 'linear' }
    ],
    label: 'Linear Scale',
    type: 'linearScale'
  },
  {
    fields: [
      { label: 'Slider', tag: 'slider' }
    ],
    label: 'Slider',
    type: 'slider'
  },
  {
    fields: [
      { label: 'Checkbox Grid', tag: 'checkbox', isGrid: true }
    ],
    label: 'Checkbox Grid',
    type: 'checkboxGrid'
  },
  {
    fields: [
      { label: 'Ranking', tag: 'ranking' }
    ],
    label: 'Ranking',
    type: 'ranking'
  },
  {
    fields: [
      { label: 'File Upload', tag: 'file' }
    ],
    label: 'File Upload',
    type: 'file'
  },
  {
    fields: [
      { label: 'Section Break', tag: 'sectionBreak' }
    ],
    label: 'Section Break',
    type: 'sectionBreak'
  },
  {
    fields: [
      { label: 'Page Break', tag: 'pageBreak' }
    ],
    label: 'Page Break',
    type: 'pageBreak'
  },
]

export const PrimeFields = [
  {
    fields: [
      { label: 'First Name', type: 'text', tag: 'input', placeholder: 'First Name' },
      { label: 'Middle Name', type: 'text', tag: 'input', placeholder: 'Middle Name' },
      { label: 'Last Name', type: 'text', tag: 'input', placeholder: 'Last Name' }
    ],
    label: 'Name',
    type: 'name'
  },
  {
    fields: [
      { label: 'File Upload', tag: 'file' }
    ],
    label: 'File Upload',
    type: 'primeFile'
  },
  {
    fields: [
      { label: 'Street Address', type: 'text', tag: 'input', placeholder: 'Street Address' },
      { label: 'Street Address Line 2', type: 'text', tag: 'input', placeholder: 'Street Address Line 2' },
      { label: 'City', type: 'text', tag: 'input', placeholder: 'City' },
      { label: 'State / Province / Region', type: 'text', tag: 'input', placeholder: 'State / Province / Region' },
      { label: 'Postal / Zip Code', type: 'text', tag: 'input', placeholder: 'Postal / Zip Code' },
      { label: 'Country', type: 'text', tag: 'select', placeholder: 'Country' }
    ],
    label: 'Address',
    type: 'address'
  },
  {
    fields: [
      { label: 'Rating', tag: 'rating' }
    ],
    label: 'Rating',
    type: 'primeRating'
  },
  {
    fields: [
      { label: 'Email', type: 'email', tag: 'input', placeholder: 'Email' },
    ],
    label: 'Email',
    type: 'email'
  },
  {
    fields: [
      { label: 'MM', type: 'text', tag: 'input', placeholder: 'MM' },
      { label: 'DD', type: 'text', tag: 'input', placeholder: 'DD' },
      { label: 'YYYY', type: 'text', tag: 'input', placeholder: 'YYYY' },
    ],
    label: 'Date',
    type: 'date'
  },
  {
    fields: [
      { label: 'Mobile', type: 'number', tag: 'input', placeholder: 'Mobile' },
      { label: 'Home', type: 'number', tag: 'input', placeholder: 'Home' },
      { label: 'Business', type: 'number', tag: 'input', placeholder: 'Business' },
    ],
    label: 'Phone',
    type: 'phone'
  },
  {
    fields: [
      { label: 'Time', type: 'text', tag: 'input', placeholder: 'Time' },
    ],
    label: 'Time',
    type: 'time'
  },
  {
    fields: [
      { label: 'Price', type: 'text', tag: 'input', placeholder: 'Price' },
    ],
    label: 'Price',
    type: 'price'
  },
  {
    fields: [
      { label: 'Website', type: 'text', tag: 'input', placeholder: 'Website' },
    ],
    label: 'Website',
    type: 'website'
  },
]
