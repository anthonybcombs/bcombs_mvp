import cloneDeep from 'lodash.clonedeep'
import React from 'react'

export default ({
  isReadOnly = false, scale = {}, items = [], onChangeFieldSettings,
  isBuilder, id: fieldId, onChange, value = {}, className
}) => {
  const handleChangeValues = ({ target: { value: ratingValue } }, type, subType, index) => {
    if (type === 'scale') {
      ratingValue = ratingValue * 1
      let newItems = cloneDeep(items)
      const newItemLen = newItems.length
      if (newItemLen > ratingValue) {
        newItems = newItems.slice(0, ratingValue)
      } else if (newItemLen < ratingValue) {
        const remainder = ratingValue - newItemLen
        const addFields = Array(remainder).fill(null).map((e, i) => ({ label: '', rank: newItemLen + i + 1 }))
        newItems = [...newItems, ...addFields]
      }
      onChangeFieldSettings({ scale: { max: ratingValue }, items: newItems })
    } else {
      const newItems = cloneDeep(items)
      onChangeFieldSettings({
        items: newItems.map((item, i) => ({
          ...item,
          [subType]: i === index
            ? subType === 'rank' ? (ratingValue * 1) : ratingValue
            : item[subType]
        }))
      })
    }
  }

  
  const handleAnswer = (rate) => {
    onChange({ target: { id: fieldId, value: rate } })
  }

  const answerIndex = items.findIndex(e => e.rank === value.rank)

  return (
    <div className={className}>
      {
        isBuilder ? (
          <div className='rating-container'>
            <div className='rating-scaleSet'>
              <p>Scale:</p>
              <div className='field select-field-wrapper'>
                <select
                  value={scale.max}
                  className='field-input'
                  onChange={(e) => handleChangeValues(e, 'scale', 'max')}
                >
                  {
                    [2,3,4,5,6,7,8,9,10].map((num, index) => {
                      return (<option key={'scale' + index} value={num}>{num}</option>)
                    })
                  }
                </select>
              </div>
            </div>
            <div className='tableWrapper'>
              <table className='rating-table'>
                <thead>
                  <tr>
                    <td></td>
                    <td>Labels</td>
                    <td align='center'>Value</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    items.map((item, index) => {
                      return (
                        <tr key={`ratingRow-${index}`}>
                          <td className='ratingNo'>{index + 1} {`Star${!index ? '' : 's'}`}</td>
                          <td className='labels'>
                            <input
                              type='text'
                              className='field-input'
                              placeholder='Enter Label (optional)'
                              value={item.label || ''}
                              onChange={(e) => handleChangeValues(e, 'items', 'label', index)}
                            />
                          </td>
                          <td className='value'>
                            <input
                              type='text'
                              className='field-input'
                              value={item.rank || ''}
                              onChange={(e) => handleChangeValues(e, 'items', 'rank', index)}
                            />
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            
            </div>
          </div>
        ) : (
          <div className='ratingForm'>
            {
              items.map(({ label, rank }, index) => {
                return (
                  <div key={`ratingStar-${index}`} className='ratingItem'>
                    <div className='ratingLabel'>{label}</div>
                    <div className='starRating'>
                      <input
                        id={`star-${index}`}
                        type='checkbox'
                        readOnly={isReadOnly}
                        checked={answerIndex >= index}
                        onChange={() => isReadOnly ? () => {} : handleAnswer({ label, rank })}
                      />
                      <label htmlFor={`star-${index}`} />
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}