import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { id } from 'date-fns/locale'
import cloneDeep from 'lodash.clonedeep'
import React, { useState } from 'react'

export default ({
  fields, pageBreaks, hasPageBreak, breakedFields, generalSettings, onChangeGeneralSettings
}) => {
  const { logic: { items = '[]' } } = generalSettings
  const { options  } = fields[0]
  let itemArr = JSON.parse(items)
  
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
      { value: 'firstPage', label: 'First Page' },
      ...pageOptions
    ]
  }

  const handleChange = ({ target: { value } }, name, type) => {
    const exists = itemArr.find(e => e.name === name)
    
    itemArr = !exists
      ? [...itemArr, { name, [type]: value }]
      : itemArr.map((e) => {
          if (e.name === name) {
            e[type] = value
            if (type === 'pageId') {
              e.fieldId = ''
            }
          }
          return e
        })

    onChangeGeneralSettings({ ...generalSettings, logic: { include: true, items: JSON.stringify(itemArr) } })
  }

  const handleClear = (name = '') => {
    itemArr = name ? itemArr.filter(e => e.name !== name) : []
    onChangeGeneralSettings({ ...generalSettings, logic: { include: true, items: JSON.stringify(itemArr) } })
  }
  
  console.log('@@@LOGICCCCCCCC', { itemArr })

  return (
    <div className='settings-logic'>
      <table style={{ width: '100%' }} className='logic-table'>
        <thead>
          <tr>
            <th align='left' className='label'>If answer is ...</th>
            <th align='left' className='dropdown-options'>Then skip to ...</th>
            <th align='right' className='actions'>
              {
                itemArr.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClear()
                    }}
                  >
                    Clear All
                  </button>
                )
              }
            </th>
          </tr>
        </thead>
        <tbody>
          {
            options.map(({ label, name }, index) => {
              const { pageId = '', fieldId = '' } = itemArr.find(e => e.name === name) || {}
              const pageFields = (pageId && pageId !== 'end'
                ? hasPageBreak
                  ? (breakedFields.find(e => e.id === pageId) || {}).formFields || []
                  : breakedFields
                : []).map(e => ({ value: e.id, label: e.label }))

              return (
                <tr key={`options-${index}`}>
                  <td align='left' className='label'>{label}</td>
                  <td align='left' className='dropdown-options'>
                    
                    <div className='logic-options'>
                      <div className='field select-field-wrapper'>
                        <select
                          value={pageId}
                          className='field-input'
                          onChange={e => handleChange(e, name, 'pageId')}
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
                      </div>
                      {
                        pageFields.length > 0 && (
                          <div className='field select-field-wrapper'>
                            <select
                              value={fieldId}
                              className='field-input'
                              onChange={e => handleChange(e, name, 'fieldId')}
                            >
                              <option value=''>Choose Field</option>
                              {
                                pageFields.map((foption, i) => (
                                  <option key={`fieldOption-${i}`} value={foption.value}>
                                    {foption.label}
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                        )
                      }
                    </div>
                  </td>
                  <td align='right' className='actions'>
                    {
                      pageId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClear(name)
                          }}
                        >
                          Clear
                        </button>
                      )
                    }
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