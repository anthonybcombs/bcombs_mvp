import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FormStyled from './styles'
import Loading from "../../../helpers/Loading.js"

import { requestVendor } from '../../../redux/actions/Vendors'
import { requestGetForms } from '../../../redux/actions/FormBuilder'

import Headers from './headers'
import List from './list'

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
  
  const [isLoading, setIsLoading] = useState(false)
  const [vendor, setVendor] = useState()

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id))
      setIsLoading(true)
    }
  }, [])

  useEffect(() => {
    if(vendors && vendors.length > 0) {
      dispatch(requestGetForms(vendors[0].id))
      setIsLoading(true)
    }
  }, [vendors])
 
  useEffect(() => {
    if (isLoading && !loading.getForm) {
      setIsLoading(false)
    }
  }, [loading.getForm])
  
  console.log('wewwwwwwwwwwww', { isLoading, formList })

  return (
    <FormStyled>
      <Headers />
      {
        isLoading ? (
          <Loading />
        ) : (
          <List
            list={formList}
          />
        )
      }
    </FormStyled>
  )
}