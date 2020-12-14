import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default ({ isReadOnly = false, scale, scaleLabels, onChangeFieldSettings, isBuilder, id: fieldId, onChange, value, className }) => {
  const handleChangeValues = ({ target: { value: sliderValue } }, type, subType) => {
    const currentTypeData = type === 'scale' ? { ...scale } : { ...scaleLabels }
    onChangeFieldSettings({ [type]: { ...currentTypeData, [subType]: sliderValue } })
  }

  const handleBlurValues = (type) => {
    let { min, max } = scale
    min = min < 0 || min === '' ? 0 : min
    max = max < 1 || max === '' ? 1 : max
    if (type === 'min' && min >= max) {
      max = (min * 1) + 1
    }
    if (type ==='max' && max <= min) {
      min = (max * 1) - 1
    }
    onChangeFieldSettings({ scale: { min, max }})
  }

  const handleAnswer = ({ target: { value: sliderValue } }) => {
    onChange({ target: { id: fieldId, value: sliderValue } })
  }

  return (
    <>
      {
        isBuilder ? (
          <div className='slider-container'>
            <div className='tooltip-wrapper'>
              <p className='label'>Scale Range
                <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
              </p>
              <span className='tooltip'>Scale range must be a whole number from 0 or greater.</span>
            </div>
            <div className='slider-scale-number'>
              <input
                type='number'
                value={scale.min}
                className='field-input'
                onChange={(e) => handleChangeValues(e, 'scale', 'min')}
                onBlur={(e) => handleBlurValues('min')}
              />
              <span>to</span>
              <input
                type='number'
                value={scale.max}
                className='field-input'
                onChange={(e) => handleChangeValues(e, 'scale', 'max')}
                onBlur={(e) => handleBlurValues('max')}
              />
            </div>

            <div className='slider-scale-range'>
              <p>Scale Range Labels</p>
              <label>
                <span>Left Label</span>
                <input
                  type='text'
                  placeholder='Label'
                  className='field-input'
                  value={scaleLabels.left}
                  onChange={(e) => handleChangeValues(e, 'scaleLabels', 'left')}
                />
              </label>

              <label>
                <span>Center Label</span>
                <input
                  type='text'
                  className='field-input'
                  placeholder='Label (optional)'
                  value={scaleLabels.center}
                  onChange={(e) => handleChangeValues(e, 'scaleLabels', 'center')}
                />
              </label>

              <label>
                <span>Right Label</span>
                <input
                  type='text'
                  placeholder='Label'
                  className='field-input'
                  value={scaleLabels.right}
                  onChange={(e) => handleChangeValues(e, 'scaleLabels', 'right')}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className={`slider-field ${className}`}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>{scaleLabels.left}</div>
                <div>{scaleLabels.center}</div>
                <div>{scaleLabels.right}</div>
              </div>
              <input
                style={{ width: '100%' }}
                type='range'
                readOnly={isReadOnly}
                min={scale.min}
                max={scale.max}
                value={value || 0}
                onChange={(e) => isReadOnly ? () => {} : handleAnswer(e)}
              />
            </div>
            <div>
              <input
                className='field-input'
                type='text'
                readOnly={true}
                value={value || 0}
              />
            </div>
          </div>
        )
      }
    </>
  )
}