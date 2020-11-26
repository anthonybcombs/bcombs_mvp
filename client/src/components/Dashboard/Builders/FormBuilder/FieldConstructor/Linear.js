import React from 'react'

export default ({ min, max, onChangeFieldSettings, isBuilder, id: fieldId, onChange, value }) => {
  const handleChangeValues = ({ target: { value } }, type, subType) => {
    const currentTypeData = type === 'min' ? { ...min } : { ...max }
    onChangeFieldSettings({ [type]: { ...currentTypeData, [subType]: value } })
  }

  
  const handleAnswer = ({ target: { value: linearValue } }) => {
    onChange({ target: { id: fieldId, value: (linearValue * 1) } })
  }

  const { value: minValue, label: minLabel } = min
  const { value: maxValue, label: maxLabel } = max

  return (
    <>
      {
        isBuilder ?
          (
            <div className='linear-container'>
              <div className='scale-number'>
                <div className='field select-field-wrapper'>
                  <select
                    value={min.value}
                    className='field-input'
                    onChange={(e) => handleChangeValues(e, 'min', 'value')}
                  >
                    {
                      [0, 1].map((num, index) => {
                        return (<option key={'min' + index} value={num}>{num}</option>)
                      })
                    }
                  </select>
                </div>
                <span>to</span>
                <div className='field select-field-wrapper'>
                  <select
                    value={max.value}
                    className='field-input'
                    onChange={(e) => handleChangeValues(e, 'max', 'value')}
                  >
                    {
                      Array(10).fill(null).map((num, index) => {
                        const val = index + 1
                        return val > 1
                          ? <option key={'max' + val} value={val}>{val}</option>
                          : null
                      })
                    }
                  </select>
                </div>
              </div>
    
              <div className='scale-label'>
                <span>{min.value}</span>
                <input
                  type='text'
                  className='field-input'
                  placeholder='Lowest Scale Label (scale-labelal)'
                  value={min.label}
                  onChange={(e) => handleChangeValues(e, 'min', 'label')}
                />
              </div>
              <div className='scale-label'>
                <span>{max.value}</span>
                <input
                  type='text'
                  className='field-input'
                  placeholder='Highest Scale Label (optional)'
                  value={max.label}
                  onChange={(e) => handleChangeValues(e, 'max', 'label')}
                />
              </div>
            </div>
          ) : (
            <div className='scaleForm'>
              {
                minLabel && <p className='linear-label'>{minLabel}</p>
              }
              <div className='scaleForm-choices'>
                {
                  Array(maxValue - (minValue-1)).fill(null).map((e, i) => {
                    return (
                      <div className='scaleForm-value'>
                        <div className='radiobuttonContainer'>
                          <input
                            id={`radio_${minValue + i}`}
                            type='radio'
                            value={minValue + i}
                            checked={value === (minValue + i)}
                            onChange={e => handleAnswer(e)}
                          />
                          <label htmlFor={`radio_${minValue + i}`}><span>{minValue + i}</span></label>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              {
                maxLabel && <p className='linear-label'>{maxLabel}</p>
              }
            </div>
          )
      }
    </>
  )
}