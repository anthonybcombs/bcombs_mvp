import React from 'react'
import FormBuilder from './FormBuilder'
import ReportBulder from './ReportBuilder'

export default (props) => {
  const { form_id, type } = props

  if (type === 'report') {
    return <ReportBulder {...props} />
  } else {
    return <FormBuilder {...props} />
  }
}