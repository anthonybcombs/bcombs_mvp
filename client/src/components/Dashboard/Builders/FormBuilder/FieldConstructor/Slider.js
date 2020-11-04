import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default ({ scale, scaleLabels, onChangeFieldSettings }) => {
  const handleChangeValues = ({ target: { value } }, type, subType) => {
    const currentTypeData = type === 'scale' ? { ...scale } : { ...scaleLabels }
    onChangeFieldSettings({ [type]: { ...currentTypeData, [subType]: value } })
    console.log('atay', { value, a: value < 0, b: typeof value, c: isNaN(value)})
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
  return (
    // <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
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
  )
}