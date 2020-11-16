import cloneDeep from 'lodash.clonedeep'

export const groupFieldsByPageBreak = (fields) => {
  let currAccId = ''
  return cloneDeep(fields)
    .reverse()
    .reduce((acc, curr) => {
      if (curr.type === 'pageBreak' && curr.id !== currAccId) {
        currAccId = curr.id
        acc = [curr, ...acc]
      } else {
        acc = acc.map(e => {
          if (e.id === currAccId) {
            e.formFields = [
              curr,
              ...(e.formFields || [])
            ]
          } 
          
          return e
        })
      }

      return acc
    }, [])
    .filter(e => !!e.formFields)
}


export const getFieldsByPageBreak = (fields, pageBreakId) => {

}