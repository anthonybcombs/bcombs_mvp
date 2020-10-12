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
      { key: 'singleLineText', label: 'Single Line Text', type: 'text', tag: 'input', placeholder: 'Single LIne Text' }
    ],
    label: 'Single Line Text',
    type: 'singleLineText',
  },
  {
    fields: [
      { key: 'numbers', label: 'Numbers', type: 'number', tag: 'input', placeholder: 'Numbers' }
    ],
    label: 'Numbers',
    type: 'numbers'
  },
  {
    fields: [
      { key: 'paragraphText', label: 'Paragraph Text', type: 'text', tag: 'textarea', placeholder: 'Paragraph Text' }
    ],
    label: 'Paragraph Text',
    type: 'paragraphText'
  },
  {
    fields: [
      { key: 'checkboxes', label: 'Checkboxes', tag: 'checkbox' }
    ],
    label: 'Checkboxes',
    type: 'checkboxes'
  },
  {
    fields: [
      { key: 'multipleChoice', label: 'Multiple Choice', tag: 'multipleChoice', multiple: false }
    ],
    label: 'Multiple Choice',
    type: 'multipleChoice'
  },
  {
    fields: [
      { key: 'dropDown', label: 'Dropdown', type: 'text', tag: 'select', placeholder: 'Dropdown' }
    ],
    label: 'Dropdown',
    type: 'dropDown'
  },
  {
    fields: [
      { key: 'rating', label: 'Matrix / Rating', tag: 'rating' }
    ],
    label: 'Matrix / Rating',
    type: 'rating'
  },
  {
    fields: [
      { key: 'radioButton', label: 'Radio Button', tag: 'radio' }
    ],
    label: 'Radio Button',
    type: 'radioButton'
  },
  {
    fields: [
      { key: 'linearScale', label: 'Linear Scale', tag: 'linear' }
    ],
    label: 'Linear Scale',
    type: 'linearScale'
  },
  {
    fields: [
      { key: 'slider', label: 'Slider', tag: 'slider' }
    ],
    label: 'Slider',
    type: 'slider'
  },
  {
    fields: [
      { key: 'checkboxGrid', label: 'Checkbox Grid', tag: 'checkbox', isGrid: true }
    ],
    label: 'Checkbox Grid',
    type: 'checkboxGrid'
  },
  {
    fields: [
      { key: 'ranking', label: 'Ranking', tag: 'ranking' }
    ],
    label: 'Ranking',
    type: 'ranking'
  },
  {
    fields: [
      { key: 'file', label: 'File Upload', tag: 'file' }
    ],
    label: 'File Upload',
    type: 'file'
  },
  {
    fields: [
      { key: 'sectionBreak', label: 'Section Break', tag: 'sectionBreak' }
    ],
    label: 'Section Break',
    type: 'sectionBreak'
  },
  {
    fields: [
      { key: 'pageBreak', label: 'Page Break', tag: 'pageBreak' }
    ],
    label: 'Page Break',
    type: 'pageBreak'
  },
]

export const PrimeFields = [
  {
    fields: [
      { key: 'firstName', label: 'First Name', type: 'text', tag: 'input', placeholder: 'First Name' },
      { key: 'middleName', label: 'Middle Name', type: 'text', tag: 'input', placeholder: 'Middle Name' },
      { key: 'lastName', label: 'Last Name', type: 'text', tag: 'input', placeholder: 'Last Name' }
    ],
    label: 'Name',
    type: 'name'
  },
  {
    fields: [
      { key: 'primeFile', label: 'File Upload', tag: 'file' }
    ],
    label: 'File Upload',
    type: 'primeFile'
  },
  {
    fields: [
      { key: 'street1', label: 'Street Address', type: 'text', tag: 'input', placeholder: 'Street Address' },
      { key: 'street2', label: 'Street Address Line 2', type: 'text', tag: 'input', placeholder: 'Street Address Line 2' },
      { key: 'city', label: 'City', type: 'text', tag: 'input', placeholder: 'City' },
      { key: 'state', label: 'State / Province / Region', type: 'text', tag: 'input', placeholder: 'State / Province / Region' },
      { key: 'zipcode', label: 'Postal / Zip Code', type: 'text', tag: 'input', placeholder: 'Postal / Zip Code' },
      { key: 'country', label: 'Country', type: 'text', tag: 'select', placeholder: 'Country' }
    ],
    label: 'Address',
    type: 'address'
  },
  {
    fields: [
      { key: 'primeRating', label: 'Rating', tag: 'rating' }
    ],
    label: 'Rating',
    type: 'primeRating'
  },
  {
    fields: [
      { key: 'email', label: 'Email', type: 'email', tag: 'input', placeholder: 'Email' },
    ],
    label: 'Email',
    type: 'email'
  },
  {
    fields: [
      { key: 'month', label: 'MM', type: 'text', tag: 'input', placeholder: 'MM' },
      { key: 'day', label: 'DD', type: 'text', tag: 'input', placeholder: 'DD' },
      { key: 'year', label: 'YYYY', type: 'text', tag: 'input', placeholder: 'YYYY' },
    ],
    label: 'Date',
    type: 'date'
  },
  {
    fields: [
      { key: 'mobile', label: 'Mobile', type: 'number', tag: 'input', placeholder: 'Mobile' },
      { key: 'home', label: 'Home', type: 'number', tag: 'input', placeholder: 'Home' },
      { key: 'business', label: 'Business', type: 'number', tag: 'input', placeholder: 'Business' },
    ],
    label: 'Phone',
    type: 'phone'
  },
  {
    fields: [
      { key: 'time', label: 'Time', type: 'text', tag: 'input', placeholder: 'Time' },
    ],
    label: 'Time',
    type: 'time'
  },
  {
    fields: [
      { key: 'price', label: 'Price', type: 'text', tag: 'input', placeholder: 'Price' },
    ],
    label: 'Price',
    type: 'price'
  },
  {
    fields: [
      { key: 'website', label: 'Website', type: 'text', tag: 'input', placeholder: 'Website' },
    ],
    label: 'Website',
    type: 'website'
  },
]
