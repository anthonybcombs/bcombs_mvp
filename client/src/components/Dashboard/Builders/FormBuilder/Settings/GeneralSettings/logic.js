import { id } from 'date-fns/locale'
import React from 'react'

export default ({
  fields, pageBreaks, hasPageBreak, breakedFields, generalSettings
}) => {
  const { options  } = fields[0]
  
  let pageOptions = [
    { value: 'end', label: 'End of Survey' }
  ]

  if (hasPageBreak) {
    const breaks = pageBreaks.map(({ id, label }) => ({ value: id, label }))
    pageOptions = [
      ...breaks,
      ...pageOptions
    ]
  } else {
    pageOptions = [
      { value: '', label: 'First Page' },
      ...pageOptions
    ]
  }

  const handleChange = ({ target: { value }, index, type }) => {
    
  }
  
  console.log('@@@LOGICCCCCCCC', { fields, hasPageBreak, breakedFields, pageBreaks, pageOptions, generalSettings })

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>If answer is ...</th>
            <th>Then skip to ...</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            options.map(({ label, name }, index) => {
              return (
                <tr key={`options-${index}`}>
                  <td>{label}</td>
                  <td>
                    <select
                      onChange={e => handleChange(e, index, 'page_id')}
                    >
                      <option value=''>Choose Page</option>
                      {
                        pageOptions.map((poption, i) => (
                          <option key={`pageOption-${i}`} value={poption.value}>
                            {poption.label}
                          </option>
                        ))
                      }
                    </select>
                  </td>
                  <td>
                    
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}