import styled from "styled-components";

export default styled.div`
  width: auto;
	max-width: 1920px;
	margin: auto;
  padding: 0rem 3em 2rem;
  
  
  #gradeListView {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
    min-height: calc(100vh - 220px);
  }

  #gradeListTableWrapper {
    overflow-x: auto;
  }

  #gradeListView-table {
		text-align: center;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 0;
	}

	#gradeListView-table tbody tr:nth-child(2) {
		background: rgb(128 128 128 / 20%);
	}

	#gradeListView-table th:not(:last-child),
	#gradeListView-table tbody tr:nth-child(2) .subHeader:not(:last-child),
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td:not(:last-child) {
		border-right: 1px solid rgb(255 255 255 / 65%);
	}

	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td {
    white-space: nowrap;
    height: 42px;
	}
	#gradeListView-table tbody tr .subHeader .subTable tr td {
		width: 200px;
	}

	#gradeListView-table td,
	#gradeListView-table th {
		border: 0;
		padding: 15px;
	}

	#gradeListView-table tr:nth-child(even) {
		background-color: #f9f9f9;
	}

	#gradeListView-table th {
		text-align: center;
		background-color: #f26e21;
		color: white;
	}

	#gradeListView-table td.subHeader {
		padding: 0;
	}

	#gradeListView-table td.subHeader table.subTable {
		width: 100%;
	}
	#gradeListView-table td.subHeader table.subTable tr {
		background: transparent;
  }
  #gradeListView-table td.subHeader table.subTable td span >svg {
    color: grey;
    transition: 0.15s ease-in-out;
  }
  #gradeListView-table td.subHeader table.subTable td span >svg:hover {
    color: #000;
  }

	#gradeListView-table a {
		color: #3e89fe;
		text-decoration: none;
	}


  .gradeListFilter {
    display: flex;
    align-items: flex-end;
    margin-bottom: 1rem;
  }

  .gradeListFilter .applyFilterBtn {
    color: #fff;
    border: none;
    padding: 12px;
    font-size: 16px;
    margin-left: auto;
    border-radius: 3px;
    font-weight: normal;
    background: #f5812f;
    transition: all .3s ease-in-out;
  }

  .gradeListFilter .applyFilterBtn:hover {
    background: #e47120;
  }





  @media (max-width: 840px) {
		padding: 0rem 1rem 2rem;
	}
`;