import cloneDeep from 'lodash.clonedeep'
import React from 'react'

export default ({ label, type, options, onChangeFieldSettings, isBuilder, id: fieldId, onChange, value = {} }) => {
  const handleChangeValues = ({ target: { value: ratingValue } }, type, subType, index) => {
    onChangeFieldSettings({ scale: { max: ratingValue }, items: newItems })
  }

  const handleAnswer = (rate) => {
    onChange({ target: { id: fieldId, value: rate } })
  }

  return (
    <>
      {
        isBuilder ? (
          <div>

          </div>
        ) : (
          <div>
            <div>
              Scale
              <select
                value={type}
                onChange={(e) => handleChangeValues(e, 'type')}
              >
                {
                  options.map((e, index) => (
                    <option key={`emailType-${index}`} value={e}>{e}</option>
                  ))
                }
              </select>
            </div>
          </div>
        )
      }
    </>
  )
}