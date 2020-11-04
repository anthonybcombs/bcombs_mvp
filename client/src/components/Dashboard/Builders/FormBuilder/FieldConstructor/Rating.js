import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

export default (props) => {
  const { scales, choices, onChangeFieldSettings, isMultiple = false } = props

  const handleAddStatement = () => {
    onChangeFieldSettings({
      choices: [
        ...choices,
        {
          statement: `Row ${choices.length + 1}`,
          answers: []
        }
      ]
    })
  }

  const handleRemoveStatement = (index) => {
    const newChoies = cloneDeep(choices)
    newChoies.splice(index, 1)
    onChangeFieldSettings({ choices: newChoies })
  }

  const handleChangeStatement = ({ target: { value } }, index) => {
    onChangeFieldSettings({
      choices: choices.map((choice, i) => {
        if (i === index) {
          return {
            ...choice,
            statement: value
          }
        }
        return choice
      })
    })
  }


  const handleAddScale = () => {
    onChangeFieldSettings({
      scales: [
        ...scales,
        {
          label: `Column ${scales.length + 1}`,
          value: scales[scales.length - 1].value + 1 || 1
        }
      ]
    })
  }

  const handleRemoveScale = (index) => {
    const newScales = cloneDeep(scales)
    newScales.splice(index, 1)
    onChangeFieldSettings({ scales: newScales })
  }

  const handleChangeScale = ({ target: { value } }, index) => {
    onChangeFieldSettings({
      scales: scales.map((scale, i) => {
        if (i === index) {
          return {
            ...scale,
            label: value
          }
        }
        return scale
      })
    })
  }

  const handleChangeScaleValue = ({ target: { value } }, index) => {
    const intVal = (value*1)
    if (isNaN(intVal)) {
      return
    }
    onChangeFieldSettings({
      scales: scales.map((scale, i) => {
        if (i === index) {
          return {
            ...scale,
            value
          }
        }
        return scale
      }),
    })
  }

  return (
    <div className='matrixRating-container'>
      <div className='table-scroll-wrapper'>
        <table className='matrixRating-table'>
          <thead className='matrixRating-table-head'>
            <tr className='scale'>
              <th colSpan={2} className='column-head-blank'/>
              {
                scales.map(({ label, value }, scaleIndex) => {
                  const cellProps = {
                    key: `col-${scaleIndex}`,
                    align: 'center' ,
                  }
                  return (
                    <th {...cellProps} className='column-head'>
                      <input
                        value={label}
                        placeholder='Scale'
                        className='field-input'
                        onChange={(e) => handleChangeScale(e, scaleIndex)}
                      />
                      <input
                        value={value}
                        placeholder='Value'
                        className='field-input'
                        onChange={(e) => handleChangeScaleValue(e, scaleIndex)}
                      />
                    </th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody className='matrixRating-table-body'>
            {
              choices.map(({ statement, answers }, index) => {
                // const [valueError = '', statementError = ''] = errors && errors.choices ? (errors.choices[index] || []) : []
                return (
                  <tr key={`statement-${index}`} className='choiceRow'>
                    <td align='right' className='removeStatement'>
                      {
                        choices.length > 1
                        && (
                          <FontAwesomeIcon
                            icon={faTimes}
                            onClick={e => {
                              e.stopPropagation()
                              handleRemoveStatement(index)
                            }}
                          />
                        )
                      }
                    </td>
                    <td align='right' className='choices'>
                      <input
                        value={statement}
                        className='inputChoice'
                        className='field-input'
                        placeholder='Type your statement here'
                        onChange={(e) => handleChangeStatement(e, index)}
                      />
                    </td>
                    {
                      scales.map((scale, scaleIndex) => {
                        return (
                          <td key={`scale=${scaleIndex}`} align='center' className='checkbox'>
                            <input
                              type={isMultiple ? 'checkbox' : 'radio'}
                            />
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
                <div className='actions'>
                  <button
                    className='outlined-addBtn'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddStatement()
                    }}
                  >
                    Add Row
                  </button>
                  <button
                    className='outlined-addBtn'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddScale()
                    }}
                  >
                    Add Column
                  </button>
                </div>
              </td>
              {
                scales.length > 1
                && scales.map((e, removeIndex) => (
                    <td key={`remove-${removeIndex}`} align='center'>
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
            handleAddStatement()
          }}
        >
          Add Row
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddScale()
          }}
        >
          Add Column
        </button>
      </div> */}
    </div>
  )
}