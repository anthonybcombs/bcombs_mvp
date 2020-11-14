import cloneDeep from 'lodash.clonedeep'
import React from 'react'

export default ({ scale, items, onChangeFieldSettings, isBuilder, id: fieldId, onChange, value = {} }) => {
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
    <>
      {
        isBuilder ? (
          <div>
            <div>
              Scale
              <select
                value={scale.max}
                onChange={(e) => handleChangeValues(e, 'scale', 'max')}
              >
                {
                  [2,3,4,5,6,7,8,9,10].map((num, index) => {
                    return (<option key={'scale' + index} value={num}>{num}</option>)
                  })
                }
              </select>
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <td>Labels</td>
                    <td>Value</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    items.map((item, index) => {
                      return (
                        <tr key={`ratingRow-${index}`}>
                          <td>{index + 1} {`Star${!index ? 's' : ''}`}</td>
                          <td>
                            <input
                              type='text'
                              placeholder='Enter Label (optional)'
                              value={item.label || ''}
                              onChange={(e) => handleChangeValues(e, 'items', 'label', index)}
                            />
                          </td>
                          <td>
                            <input
                              type='text'
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
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {
              items.map(({ label, rank }, index) => {
                return (
                  <div key={`ratingStar-${index}`}>
                    <div>{label}</div>
                    <div>
                      <input
                        type='checkbox'
                        checked={answerIndex >= index}
                        onChange={() => handleAnswer({ label, rank })}
                      />
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
      }
    </>
  )
}