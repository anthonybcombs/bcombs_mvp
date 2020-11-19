import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FormStyled from './styles'

import { requestVendor } from '../../../redux/actions/Vendors'
import { requestGetForms } from '../../../redux/actions/FormBuilder'

export default (props) => {
  
  const {
    auth, vendors, loading, 
    form: { formList }
  } = useSelector(
    ({ auth, vendors, loading, form }) => {
      return { auth, vendors, loading, form }
    }
  )
  const dispatch = useDispatch()
  let isLoading = false

  const [vendor, setVendor] = useState()

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id))
      isLoading = true
    }
  }, [])

  useEffect(() => {
    if(vendors && vendors.length > 0) {
      dispatch(requestGetForms(vendors[0].id))
    }
  }, [vendors])
  console.log('wewwwwwwwwwwww', { loading, formList })
  return (
    <FormStyled>
      Forms
    </FormStyled>
  )
}