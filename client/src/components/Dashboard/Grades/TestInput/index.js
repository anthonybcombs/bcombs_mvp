import React, { useEffect, useState } from 'react'
import GradeInputStyled from './styles'
import Loading from '../../../../helpers/Loading.js'

import { useSelector, useDispatch } from 'react-redux'

import StandardTest from './standardTest'

import { requestVendor } from '../../../../redux/actions/Vendors'
import { getStudentCumulativeGradeByAppGroup  } from '../../../../redux/actions/Grades'

export default () => {

  return (
    <GradeInputStyled>
      <h2>Grade and Test Input</h2>
      <div id='gradeInputView'>
        <StandardTest
        
        />
      </div>
    </GradeInputStyled>
  )
}
