import React, { useState } from 'react'
import ReactDOM from 'react-dom'

export default ({ activeFilter }) => {
  switch(activeFilter) {
    case 'sort': 
      return 'Sort'
    case 'column': 
      return 'Column'
    case 'highlight': 
      return 'Highlight'
    case 'date': 
      return 'Date'    
    default: 
      return null
  }
}