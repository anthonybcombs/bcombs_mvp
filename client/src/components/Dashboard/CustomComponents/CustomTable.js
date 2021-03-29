import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

const CustomTableStyled = styled.div`
  .actions {
    display: flex;
    justify-content: space-between;
    aligh-items: center;
  }
  .field {
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: column-reverse;
  }
  .search-input {
    position: relative;
    min-width: 50%;
  }
  .search-input > input {
    text-indent: 2rem !important;
    background: transparent;
  }
  .search-input > label {
    padding-left: 1.5rem;
  }
  .search-input > svg {
    color: grey;
    opacity: 0.5;
    bottom: 13px;
    font-size: 18px;
    position: absolute;
    pointer-events: none;
    padding: 0 !important;
  }
  .search-input > svg:hover {
    box-shadow: none !important;
  }

  table {
		border: 0;
		width: 100%;
    margin-top: 1rem;
    box-shadow: none;
    border: 1px solid #ddd;
		border-collapse: collapse;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
	}

	table td,
	table th {
		border: 0;
	}

  table th {
    padding: 10px;
  }

  table td {
    padding: 5px 10px;
  }

	table tr:nth-child(odd) {
		background-color: #f9f9f9;
	}

	table th {
		background-color: #f26e21;
		color: white;
    text-align: left;
	}

	table a {
		color: #3e89fe;
		text-decoration: none;
	}

  select {
    min-width: 120px!important;
    background-color: unset;
  }
`;

export default ({
  columns, rows: propRows, hasSearch,
  idKey = 'id', onSelect, selectable, headerRightActions
}) => {

  const newColumns = Object.entries(columns)
  
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState(cloneDeep([]))
  const [selected, setSelected] = useState([])

  const handleSearch = (searchKey = '') => {
    setSearch(searchKey)
  }

  const handleSelectAll = ({ target: { checked } }) => {
    setSelected(checked ? rows.map(e => e[idKey]) : [])
  }

  const handleSelect = ({ target: { checked } }, id) => {
    setSelected(checked ? [...selected, id] : selected.filter(e => e !== id))
  }

  useEffect(() => {
    const columnKeys = Object.keys(columns)
    setRows(cloneDeep(propRows).filter((row) => {
      const itemEntries = Object.entries(row).filter(([key]) => columnKeys.includes(key))
      return itemEntries.find(([key, val]) => {
        const isDate = columns[key]?.type === 'date'
        if (isDate) {
          return moment(val).format('ll').toString().toLowerCase().includes(search.toLowerCase())
        }
        return ['string', 'number'].includes(typeof val) && val.toString().toLowerCase().includes(search.toLowerCase())
      })
    }))
    // setSelected([])
  }, [search])

  useEffect(() => {
    onSelect(selected)
  }, [selected])

  useEffect(() => {
    setRows(cloneDeep(propRows))
  }, [propRows])
  
  return (
    <CustomTableStyled>
      <div className='actions'>
        {
          hasSearch && (
            <div className='field search-input'>
              <FontAwesomeIcon className='search-icon' icon={faSearch} />
              <input
                id='search'
                name='search'
                placeholder='Search'
                className='field-input'
                value={search || ''}
                onChange={(e) => {
                  handleSearch(e.target.value)
                }}
              />
            </div>
          )
        }
        {
          headerRightActions && headerRightActions
        }
      </div>
      <table>
        <thead>
          <tr>
            {
              selectable && (
                <th className='checkboxTh'>
                  <input
                    type='checkbox'
                    checked={selected.length && selected.length === propRows.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )
            }
            {
              newColumns.map(([key, obj]) => {
                return (
                  <th key={`th-ct-${key}`}>{obj.label}</th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            rows.length > 0 ? (
              rows.map((row, index) => {
                return (
                  <tr key={`tr-ct-${index}`}>
                    {
                      selectable && (
                        <td>
                          <input
                            type='checkbox'
                            checked={selected.includes(row[idKey])}
                            onChange={e => handleSelect(e, row[idKey])}
                          />
                        </td>
                      )
                    }
                    {
                      newColumns.map(([key, { func = null }]) => {
                        return (
                          <td key={`td-ct-${key}-${index}`}>
                            {
                              func ? (
                                func(row, key)
                              ) : (
                                row[key]
                              )
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            ) : (
                <tr>
                  <td colSpan={newColumns.length + (selectable ? 1 : 0)}>
                    No Records
                  </td>
                </tr>
              )
          }
        </tbody>
      </table>
    </CustomTableStyled>
  )
}