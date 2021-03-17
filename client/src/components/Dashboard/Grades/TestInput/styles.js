import styled from "styled-components";

export default styled.div`
  width: auto;
	max-width: 1920px;
	margin: auto;
  padding: 0rem 3em 2rem;
  
  
  #gradeInputView {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
    min-height: calc(100vh - 220px);
  }

	#gradeInputView .field-input {
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
		height: 100%;
    min-height: calc(100vh - 400px);
  }
	#gradeListTableWrapper::-webkit-scrollbar {
		width: 8px;
		height: 6px;
		opacity: 0;
		visibility: hidden;
	}
	#gradeListTableWrapper::-webkit-scrollbar-track {
		border-radius: 10px;
		transition: 0.5s ease-in-out;
		background: rgb(243 110 34 / 20%);
		opacity: 0;
		visibility: hidden;
	}
	#gradeListTableWrapper::-webkit-scrollbar-thumb {
		background: #f36e22;
		border-radius: 10px;
		opacity: 0;
		visibility: hidden;
	}
	#gradeListTableWrapper:hover ::-webkit-scrollbar,
	#gradeListTableWrapper:hover ::-webkit-scrollbar-track,
	#gradeListTableWrapper:hover ::-webkit-scrollbar-thumb {
		opacity: 1;
		visibility: visible;
	}

  #gradeInputView-table {
		text-align: center;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 0;
	}

	#gradeInputView-table tbody tr:nth-child(2) {
		// background: rgb(128 128 128 / 20%);
    color: #fff;
		background: rgb(75 104 197);
    border-top: 1px solid #c0caec;
	}

	#gradeInputView-table th:not(:last-child),
	#gradeInputView-table tbody tr:nth-child(2) .subHeader:not(:last-child),
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td:not(:last-child) {
		border-right: 1px solid rgb(255 255 255 / 65%);
	}

	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td {
    position: relative;
		white-space: nowrap;
    // height: 42px;
    min-width: 100px;
    white-space: initial;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td >svg {
		position: relative;
    right: -5px;
    cursor: pointer;
    transition: .15s ease-in-out;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td >svg:hover {
		color: grey;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon {
		position: absolute;
    left: 0;
    width: 180px;
    padding: 1rem;
    box-shadow: 0 3px 6px #ddd;
    background-color: rgb(255, 255, 255);
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .filter-search {
		padding-bottom: 1rem;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .filter-option {
    display: flex;
		width: 100%;
		padding 3px 0;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .filter-option label {
		cursor: pointer;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions {
		margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
		display: flex;
		justify-content: flex-end;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button {
		border: 0;
    padding: 8px 10px;
    color: white;
    max-width: 200px;
    box-shadow: none;
    border-radius: 0px;
    background-color: #f26e21;
		transition: all .3s ease-in-out;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.cancel {
    color: #f26e21;
		background: #fff;
		border: 1px solid #f26e21;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.cancel:hover {
		background: rgb(242 110 33 / 5%);
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.apply {
		margin-left: .5rem
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.apply:hover {
		background: #e47120;
	}
	#gradeInputView-table tbody tr:nth-child(2) .subHeader .subTable tr td .filterDropdwon .actions button.apply[disabled] {
		background-color: #eee;
	}
	#gradeInputView-table tbody tr .subHeader .subTable tr td {
		// width: 200px;
	}

	#gradeInputView-table td,
	#gradeInputView-table th {
		border: 0;
		padding: 12px 3px;
	}

	#gradeInputView-table tr:nth-child(even) {
		background-color: #f9f9f9;
	}

	#gradeInputView-table th {
		color: white;
    padding-top: 0;
		padding-left: 0;
		text-align: center;
		background-color: #4B68C5;
	}
	#gradeInputView-table th.standard {
    color: #000;
		text-align: left;
    font-weight: normal;
		background: transparent;
	}
	#gradeInputView-table th
	#gradeInputView-table th.th-grades {
		position: relative;
	}
	#gradeInputView-table th.th-grades >svg {
		position: relative;
    right: -5px;
		cursor: pointer;
    transition: .15s ease-in-out;
	}
	#gradeInputView-table th.th-grades >svg:hover {
		opacity: 0.5;
	}
	#gradeInputView-table th.th-grades .gradesFilter {
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
	#gradeInputView-table th.th-grades .gradesFilter .header,
	#gradeInputView-table th.th-grades .gradesFilter label {
		font-weight: normal;
		padding: 3px 0;
	}

	#gradeInputView-table td.subHeader {
		padding: 0;
	}

	#gradeInputView-table td.subHeader table.subTable {
		width: 100%;
	}
	#gradeInputView-table td.subHeader table.subTable tr {
		background: transparent;
  }
  #gradeInputView-table td.subHeader table.subTable td span >svg {
    color: grey;
    transition: 0.15s ease-in-out;
  }
  #gradeInputView-table td.subHeader table.subTable td span >svg:hover {
    color: #000;
  }
	#gradeInputView-table td.subHeader table.standardCheckbox td:first-child {
		padding: 0;
		min-width: 30px !important;
	}
	#gradeInputView-table td.subHeader table.standard tr td:first-child {
    padding: 0;
		min-width: 44px;
	}

	#gradeInputView-table td input {
		padding: 3px 4px;
    border-radius: 3px;
		border: 1.65px solid #ccc;
		transition: .15s ease-in-out;
	}
	#gradeInputView-table td input.focus-visible {
		border-color: #4B68C5;
		background: rgb(75 104 197 / 10%);
	}
	


	#gradeInputView-table a {
		color: #3e89fe;
		text-decoration: none;
	}

	.gradeInputView-table-actions {
		padding-top: 1rem;
		display: flex;
		justify-content: space-between
	}
	.gradeInputView-table-actions button {
		border: 0;
    color: white;
    box-shadow: none;
    max-width: 200px;
    // padding: 8px 10px;
    border-radius: 3px;
    background-color: #f26e21;
		transition: all .3s ease-in-out;
	}
	.gradeInputView-table-actions button.disabled {
		opacity: .35;
		cursor: auto;
	}
	.gradeInputView-table-actions button span {
		padding-left: .5rem;
	}
	.gradeInputView-table-actions .left {
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.gradeInputView-table-actions .right {
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr 1fr;
	}
	.gradeInputView-table-actions button.btn-add {
		color: #2097f3;
		background: transparent;
    border: 1px solid #2097f3;
	}
	.gradeInputView-table-actions button.btn-add:hover {
		background: rgb(32 151 243 / 10%);
	}

	.gradeInputView-table-actions button.btn-copy {
		color: orange;
    border: 1px solid;
		background: transparent;
	}
	.gradeInputView-table-actions button.btn-copy:hover {
		background: rgb(255 165 0 / 10%);
	}

	.gradeInputView-table-actions button.btn-delete {
		color: #f44336;
		background: transparent;
    border: 1px solid #f44336;
	}
	.gradeInputView-table-actions button.btn-delete:hover {
		background: rgb(244 67 54 / 10%);
	}

	.gradeInputView-table-actions button.btn-save {
    color: #f26e21;
		background: transparent;
    border: 1px solid #f26e21;
	}
	.gradeInputView-table-actions button.btn-save:hover {
		background: rgb(242 110 33 / 10%);
	}
	.gradeInputView-table-actions button.btn-review:hover {
		background: #e47120;
	}


  .gradeListFilter {
    display: flex;
    align-items: flex-end;
    margin-bottom: 1rem;
  }

	.gradeListFilter .search-input {
		margin-right: 0;
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