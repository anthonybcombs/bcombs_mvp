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
      { value: '', label: 'First Page' },
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
  
  console.log('@@@LOGICCCCCCCC', { fields, breakedFields, generalSettings })

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
              const { pageId = '', fieldId = '' } = itemArr.find(e => e.name === name) || {}
              const pageFields = (pageId
                ? hasPageBreak
                  ? (breakedFields.find(e => e.id === pageId) || {}).formFields || []
                  : breakedFields
                : []).map(e => ({ value: e.id, label: e.label }))

              return (
                <tr key={`options-${index}`}>
                  <td>{label}</td>
                  <td>
                    <select
                      value={pageId}
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
                  </td>
                  <td>
                    {
                      pageFields.length > 0 && (
                        <select
                          value={fieldId}
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