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
    <div>
      <div>
        <div className='tooltip-wrapper'>
          <p className='label'>Scale Range
            <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
          </p>
          <span className='tooltip'>Scale range must be a whole number from 0 or greater.</span>
        </div>
        <input
          type='number'
          value={scale.min}
          onChange={(e) => handleChangeValues(e, 'scale', 'min')}
          onBlur={(e) => handleBlurValues('min')}
        />
        to
        <input
          type='number'
          value={scale.max}
          onChange={(e) => handleChangeValues(e, 'scale', 'max')}
          onBlur={(e) => handleBlurValues('max')}
        />
      </div>

      <div>
        <div>
          Scale Range Labels
        </div>
        <span>Left Label</span>
        <input
          type='text'
          placeholder='Label'
          value={scaleLabels.left}
          onChange={(e) => handleChangeValues(e, 'scaleLabels', 'left')}
        />

        <span>Center Label</span>
        <input
          type='text'
          placeholder='Label (optional)'
          value={scaleLabels.center}
          onChange={(e) => handleChangeValues(e, 'scaleLabels', 'center')}
        />

        <span>Right Label</span>
        <input
          type='text'
          placeholder='Label'
          value={scaleLabels.right}
          onChange={(e) => handleChangeValues(e, 'scaleLabels', 'right')}
        />
      </div>
    </div>
  )
}