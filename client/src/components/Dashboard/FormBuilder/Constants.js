export const Items = {
  Name: 'name',
  Address: 'address'
}


export const Fields = [
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
      { key: 'street', label: 'Street Address', type: 'text', tag: 'input', placeholder: 'Street Address' },
      { key: 'city', label: 'City', type: 'text', tag: 'input', placeholder: 'City' },
      { key: 'state', label: 'State', type: 'text', tag: 'input', placeholder: 'State' }
    ],
    label: 'Address',
    type: 'address'
  }
]
