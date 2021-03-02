import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

export default ({
  isReadOnly = false, columns, rows, onChangeFieldSettings, isMultiple = false,
  isBuilder, isActive, id: fieldId, onChange, value = [], onCheckError, className
}) => {

  const handleAddRow = () => {
    onChangeFieldSettings({
      rows: [
        ...rows,
        {
          row: `Row ${rows.length + 1}`
        }
      ]
    })
  }

  const handleCheckError = (data) => {
    const newErrors = !!data.find(e => e.row.replace(/\s/g, '') === '')
      ? ['Row labels are required.']
      : []

    onCheckError(newErrors)
  }

  const handleRemoveRow = (index) => {
    const newRows = cloneDeep(rows)
    newRows.splice(index, 1)
    onChangeFieldSettings({ rows: newRows })
    handleCheckError(newRows)
  }

  const handleChangeRow = ({ target: { value } }, index) => {
    const newRows = rows.map((choice, i) => {
      if (i === index) {
        return {
          ...choice,
          row: value
        }
      }
      return choice
    })
    onChangeFieldSettings({
      rows: newRows
    })
    handleCheckError(newRows)
  }


  const handleAddColumn = () => {
    onChangeFieldSettings({
      columns: [
        ...columns,
        {
          label: `Column ${columns.length + 1}`,
          value: columns[columns.length - 1].value + 1 || 1
        }
      ]
    })
  }

  const handleRemoveScale = (index) => {
    const newcolumns = cloneDeep(columns)
    newcolumns.splice(index, 1)
    onChangeFieldSettings({ columns: newcolumns })
  }

  const handleChangeScale = ({ target: { value } }, index) => {
    onChangeFieldSettings({
      columns: columns.map((column, i) => {
        if (i === index) {
          return {
            ...column,
            label: value
          }
        }
        return column
      })
    })
  }

  const handleChangeScaleValue = ({ target: { value } }, index) => {
    const intVal = (value*1)
    if (isNaN(intVal)) {
      return
    }
    onChangeFieldSettings({
      columns: columns.map((column, i) => {
        if (i === index) {
          return {
            ...column,
            value
          }
        }
        return column
      }),
    })
  }

  const handleAnswer = (answer, index) => {
    let newValue = cloneDeep(value || [])
    const rowExists = newValue.find(e => e.row === answer.row)
    if (!rowExists) {
      newValue.splice(index, 0, answer)
    } else {
      newValue = newValue.map(e => e.row === answer.row ? answer : e)
    }
    onChange({ target: { id: fieldId, value: newValue } })
  }

  return (
    <div className={`matrixRating-container ${className}`}>
      <div className='table-scroll-wrapper'>
        <table className='matrixRating-table'>
          <thead className='matrixRating-table-head'>
            <tr className='column'>
              <th colSpan={2} className='column-head-blank'/>
              {
                columns.map(({ label, value }, columnIndex) => {
                  const cellProps = {
                    key: `col-${columnIndex}`,
                    align: 'center' ,
                  }
                  return (
                    <th {...cellProps} className='column-head'>
                      {
                        isBuilder
                         ? (
                            <input
                              value={label}
                              placeholder='Scale'
                              className='field-input'
                              onChange={(e) => handleChangeScale(e, columnIndex)}
                            />
                          ) : label
                      }
                      {
                        isBuilder && (
                          <input
                            value={value}
                            placeholder='Value'
                            className='field-input'
                            onChange={(e) => handleChangeScaleValue(e, columnIndex)}
                          />
                        )
                      }
                    </th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody className='matrixRating-table-body'>
            {
              rows.map(({ row }, rowIndex) => {
                return (
                  <tr key={`row-${rowIndex}`} className='choiceRow'>
                    <td align='right' className='removeRow'>
                      {
                        (isActive && rows.length > 1)
                        && (
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={e => {
                              e.stopPropagation()
                              handleRemoveRow(rowIndex)
                            }}
                          />
                        )
                      }
                    </td>
                    <td align='left' className='rows'>
                      {
                        isBuilder ? (
                          <input
                            value={row}
                            className='inputChoice'
                            className='field-input'
                            placeholder='Row Label'
                            onChange={(e) => handleChangeRow(e, rowIndex)}
                          />
                        ) : row
                      }
                    </td>
                    {
                      columns.map((column, columnIndex) => {
                        const { answers = [] } = (value || []).find(e => e.row === row) || {}
                        const columnAnswer = answers.find(e => e.value === column.value)
                        return (
                          <td key={`column=${columnIndex}`} align='center' className='choices'>
                            {
                              !isMultiple ? (
                                <div className='radiobuttonContainer'>
                                  <input
                                    id={`radio_${rowIndex}${columnIndex}`}
                                    type='radio'
                                    checked={!!columnAnswer}
                                    readOnly={isReadOnly}
                                    onChange={({ target: { checked } }) => {
                                      if (!isBuilder && !isReadOnly) {
                                        let answers = [...(((value || []).find(e => e.row === row) || {}).answers || [])]
                                        answers = [column]
                                        handleAnswer({ row, answers }, rowIndex)
                                      }
                                    }}
                                  />
                                  <label htmlFor={`radio_${rowIndex}${columnIndex}`}/>
                                </div>
                              ) : (
                                <label htmlFor={`checkbox_${rowIndex}${columnIndex}`} className='checkboxContainer'>
                                  <input
                                    type='checkbox'
                                    checked={!!columnAnswer}
                                    id={`checkbox_${rowIndex}${columnIndex}`}
                                    readOnly={isReadOnly}
                                    onChange={({ target: { checked } }) => {
                                      if (!isBuilder && !isReadOnly) {
                                        let answers = [...(((value || []).find(e => e.row === row) || {}).answers || [])]
                                        if (checked) {
                                          answers.splice(columnIndex, 0, column)
                                        } else {
                                          answers = answers.filter(e => e.value !== column.value)
                                        }
                                        handleAnswer({ row, answers }, rowIndex)
                                      }
                                    }}
                                  />
                                  <span className='checkmark' />
                                </label>
                              )
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
            <tr>
              <td colSpan={2}>
                {
                  isActive && (
                    <div className='actions'>
                      <button
                        className='outlined-addBtn'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddRow()
                        }}
                      >
                        Add Row
                      </button>
                      <button
                        className='outlined-addBtn'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddColumn()
                        }}
                      >
                        Add Column
                      </button>
                    </div>
                  )
                }
              </td>
              {
                columns.length > 1
                && columns.map((e, removeIndex) => (
                    <td key={`remove-${removeIndex}`} align='center'>
                      {
                        isActive && (
                          <div className='tooltip-wrapper removeScale'>
                            <FontAwesomeIcon
                              icon={faMinusCircle}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveScale(removeIndex)
                              }}
                            />
                            <span className='tooltip'>Remove Scale</span>
                          </div>
                        )
                      }
                    </td>
                  ))
              }
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddRow()
          }}
        >
          Add Row
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddColumn()
          }}
        >
          Add Column
        </button>
      </div> */}
    </div>
  )
}