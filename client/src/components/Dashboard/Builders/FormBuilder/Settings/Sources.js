const validationTypes = {
  text: 'Text',
  number: 'Number',
  length: 'Length'
}


const validationOptions = {
  text: {
    'contains': {
      label: 'Contains',
      func: (ans, text) => ans.includes(text)
    },
    'doestContain': {
      label: `Doesn't contain`,
      func: (ans, text) => !ans.includes(text)
    },
    'emailAddress': {
      label: `Email Address`,
      func: (ans) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(ans)
    }
  },
  number: {
    'greaterThan': {
      label: 'Greater than',
      func: (ans, min) => ans > min
    },
    'greaterThanOrEqualTo': {
      label: 'Greater than or equal to',
      func: (ans, min) => ans >= min
    },
    'lessThan': {
      label: 'Less than',
      func: (ans, max) => ans < max
    },
    'lessThanOrEqualTo': {
      label: 'Less than or equal to',
      func: (ans, max) => ans <= max
    },
    'notEqualTo': {
      label: 'Not equal to',
      func: (ans, num) => ans !== num
    },
    'isNumber': {
      label: 'Is number',
      func: (ans) => !isNaN(ans)
    }
  },
  length: {
    'maxCharCount': {
      label: 'Maximum character count',
      func: (ans, max) => ans.length <= max
    },
    'minCharCount': {
      label: 'Minimum character count',
      func: (ans, min) => ans.length >= min
    },
  }
}

export const Sources = {
  validationTypes,
  validationOptions
}