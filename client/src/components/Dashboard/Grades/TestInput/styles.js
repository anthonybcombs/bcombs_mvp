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

	#gradeListView .field-input {
		border: 0;
    cursor: text;
    color: #555;
    width: 100%;
    padding: 5px 0;
    font-size: 16px;
    line-height: 1.8;
    border-radius: 0;
    text-indent: 5px;
    font-family: inherit;
    border-bottom: 1.65px solid #ccc;
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
    position: relative;
		white-space: nowrap;
    height: 42px;
    // min-width: 100px;
    white-space: initial;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td >svg {
		position: relative;
    right: -5px;
    cursor: pointer;
    transition: .15s ease-in-out;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td >svg:hover {
		color: grey;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon {
		position: absolute;
    left: 0;
    width: 180px;
    padding: 1rem;
    box-shadow: 0 3px 6px #ddd;
    background-color: rgb(255, 255, 255);
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .filter-search {
		padding-bottom: 1rem;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .filter-option {
    display: flex;
		width: 100%;
		padding 3px 0;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .filter-option label {
		cursor: pointer;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions {
		margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
		display: flex;
		justify-content: flex-end;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button {
		border: 0;
    padding: 8px 10px;
    color: white;
    max-width: 200px;
    box-shadow: none;
    border-radius: 0px;
    background-color: #f26e21;
		transition: all .3s ease-in-out;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.cancel {
    color: #f26e21;
		background: #fff;
		border: 1px solid #f26e21;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.cancel:hover {
		background: rgb(242 110 33 / 5%);
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.apply {
		margin-left: .5rem
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.apply:hover {
		background: #e47120;
	}
	#gradeListView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.apply[disabled] {
		background-color: #eee;
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
	#gradeListView-table th.th-grades {
		position: relative;
	}
	#gradeListView-table th.th-grades >svg {
		position: relative;
    right: -5px;
		cursor: pointer;
    transition: .15s ease-in-out;
	}
	#gradeListView-table th.th-grades >svg:hover {
		opacity: 0.5;
	}
	#gradeListView-table th.th-grades .gradesFilter {
		position: absolute;
    right: calc(100% - 80%);
    
		display: flex;
		justify-content: flex-start;
    align-items: flex-start;

		z-index: 1;
    color: #000;
    width: 100%;
    padding: 1rem;
    margin-top: 5px;
		max-width: 180px;
    background: #fff;
    flex-direction: column;
    box-shadow: 0 3px 6px #ddd;
	}
	#gradeListView-table th.th-grades .gradesFilter .header,
	#gradeListView-table th.th-grades .gradesFilter label {
		font-weight: normal;
		padding: 3px 0;
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

	.back-btn {
		width: 50px;
		color: #3e89fe;
		display: flex;
		align-items: center;
		padding-bottom: 1rem;
		text-decoration: none;
	}
	.back-btn svg {
		padding-right: 5px;
	}




  @media (max-width: 840px) {
		padding: 0rem 1rem 2rem;
	}
`;