import React from 'react'
import ReactLoading from 'react-loading'
import styled from 'styled-components'

const LoadingStyled = styled.div`
  div.dialog-loading {
    margin: auto;
  }
`;

export default () => {
  return (
    <LoadingStyled>
      <ReactLoading
        type={'balls'}
        color={'#f26e21'}
        height={'auto'}
        width={'10%'}
        className='dialog-loading'
      />
    </LoadingStyled>
  )
}