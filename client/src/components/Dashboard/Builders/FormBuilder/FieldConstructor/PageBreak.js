import React from 'react'

export default (props) => {
  const { pageBreakLabel, id = '', onChangeFieldSettings, isBuilder, pageBreaks, isLastPageBreak, value = '' } = props
  const pageOptions = [
    ...pageBreaks.map((e, index) => ({ value: e.id, label: `Page ${index + 1} (${e.label})` })).filter(e => !id.includes(e.value)),
    { value: 'end', label: 'Submit Form' }
  ]

  const handleSelect = ({ target: { value: pageValue } }) => {
    onChangeFieldSettings({ value: pageValue })
  }
  
  const pageBreakIndex = pageBreaks.findIndex(e => id.includes(e.id))

  return (
    <div className={`field select-field-wrapper ${!isLastPageBreak ? 'pageBreak' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
      {
        (isBuilder && !isLastPageBreak) && (
          <>
            <div style={{ paddingRight: '10px' }}>After Page {pageBreakIndex + 1} ({pageBreakLabel})</div>
            <select
              value={value}
              className='field-input pageBreak'
              onChange={handleSelect}
            >
              <option value=''>Proceed to next page</option>
              {
                pageOptions.map((poption, i) => (
                  <option key={`pageOption-${i}`} value={poption.value}>
                    {poption.label}
                  </option>
                ))
              }
            </select>
          </>
        )
      }
    </div>
  )
}