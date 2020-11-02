import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

export default (props) => {
  const { scales, choices, onChangeFieldSettings } = props

  const handleAddStatement = () => {
    onChangeFieldSettings({
      choices: [
        ...choices,
        {
          statement: `Statement ${choices.length + 1}`,
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
          label: `Scale ${scales.length + 1}`,
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
    <>
      <table>
        <thead>
          <tr className='scale'>
            <td colSpan={2} />
            {
              scales.map(({ label, value }, scaleIndex) => {
                const cellProps = {
                  key: `col-${scaleIndex}`,
                  align: 'left' ,
                }
                return (
                  <td {...cellProps}>
                    <input
                      value={label}
                      placeholder='Scale'
                      onChange={(e) => handleChangeScale(e, scaleIndex)}
                    />
                    <input
                      value={value}
                      placeholder='Value'
                      onChange={(e) => handleChangeScaleValue(e, scaleIndex)}
                    />
                  </td>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
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
                      placeholder='Type your statement here'
                      onChange={(e) => handleChangeStatement(e, index)}
                    />
                  </td>
                  {
                    scales.map((scale, scaleIndex) => {
                      return (
                        <td key={`scale=${scaleIndex}`} align='center' className='checkbox'>
                          <input
                            type='radio'
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
            <td colSpan={2} />
            {
              scales.length > 1
              && scales.map((e, removeIndex) => (
                  <td key={`remove-${removeIndex}`} align='left'>
                    <button
                      className='removeIcon removeScale'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveScale(removeIndex)
                      }}
                    >
                      Remove Scale
                    </button>
                  </td>
                ))
            }
          </tr>
        </tbody>
      </table>
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddStatement()
          }}
        >
          Add a statement
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddScale()
          }}
        >
          Add Scale
        </button>
      </div>
    </>
  )
}