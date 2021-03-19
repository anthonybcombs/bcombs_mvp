export const FilterOptionsObj = {
  date: {
    label: 'Grade Date'
  },
  sort: {
    label: 'Sort'
  },
  highlight: {
    label: 'Highlight',
    conditions: {
      gt: (val, [num]) => val > num,
      lt: (val, [num]) => val < num,
      bt: (val, [firstNum, secondNum]) => val > firstNum && val < secondNum,
      eq: (val, [num]) => val == num,
      contains: (val, [txt]) => val.toLowerCase().includes(txt.toLowerCase()),
    }
  },
  column: {
    label: 'Column'
  }
}