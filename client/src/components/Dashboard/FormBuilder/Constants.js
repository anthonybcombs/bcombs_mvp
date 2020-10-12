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
      { key: 'street1', label: 'Street Address', type: 'text', tag: 'input', placeholder: 'Street Address' },
      { key: 'street2', label: 'Street Address Line 2', type: 'text', tag: 'input', placeholder: 'Street Address Line 2' },
      { key: 'city', label: 'City', type: 'text', tag: 'input', placeholder: 'City' },
      { key: 'state', label: 'State', type: 'text', tag: 'input', placeholder: 'State/Province/Region' },
      { key: 'zipcode', label: 'Zipe Code', type: 'text', tag: 'input', placeholder: 'Postal/Zip Code' },
      { key: 'country' , label: 'Country', type: 'text', tag: 'input', placeholder: 'Country' }
    ],
    label: 'Address',
    type: 'address'
  }
]
