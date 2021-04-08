import styled from "styled-components";

export default styled.div`
  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 95%;
    padding: 0;
  }
  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    color: #fff;
  }
  .modal-header {
    padding: 1em;
    background-color: #f26e21;
    color: #fff;
  }

  .modal-container {
    padding: 1.5rem;
  }
  
  
  .field-input {
    position: relative;

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

    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .populate {
    padding: 8px 0;
    text-align: right;
  }

  .populate label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .populate label span.labelName {
    padding: 0;
    cursor: pointer;
    margin-left: 10px;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    padding: 1.5rem;
  }
  .modalBtn {
    width: 100%;
    border: none;
    color: white;
    padding: 10px;
    max-width: 120px;
    margin-left: .5rem;
    background-color: #f26e21;
    font-size: 0.8em !important;
    border-radius: 0 !important;
    transition: .15s ease-in-out;
  }
  .modalBtn:hover {
    box-shadow: 0 3px 3px #ddd;
  }
  .modalBtn:disabled {
    color: #ccc;
    border: 1px solid #ccc;
    background-color: transparent;
    box-shadow: unset!important;
  }
  .discardAndPreviewBtn:hover {
    background-color: #e26218;
  }
  .cancelBtn {
    color: #f26e21;
    max-width: 80px;
    margin-right: auto;
    border: 1px solid #f26e21;
    background-color: transparent;
  }
  .cancelBtn:hover {
    background-color: rgb(242 110 33 / 5%);
  }

  #gradeListTableWrapper {
		height: 100%;
    overflow-x: auto;
		overflow-y: unset;
    min-height: 300px;
    max-height: calc(100vh - 350px);
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
    border: 0;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }

  #gradeInputView-table input {
    padding: 4px;
    border-radius: 3px;
    border: 1.65px solid #ccc;
    -webkit-transition: .15s ease-in-out;
    transition: .15s ease-in-out;
    max-width: 72px;
  }
  #gradeInputView-table input.focus-visible {
		border-color: #4B68C5;
		background: rgb(75 104 197 / 10%);
	}

  #gradeInputView-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  #gradeInputView-table td,
  #gradeInputView-table th {
    border: 0;
    padding: 12px 3px;
  }

  #gradeInputView-table thead tr th:not(:last-child) {
    border-right: 1px solid rgb(255 255 255 / 50%);
  }

  #gradeInputView-table tr:not(.row-header) th {
    background-color: #FFE391;
    border-bottom: 1px solid rgb(255 255 255 / 50%);
  }

  #gradeInputView-table tr.row-header th {
    position: sticky;
    top: -1px;
    background-color: #fbc00f;
  }


  #gradeInputView-table td >div {
    display: grid;
    grid-gap: 5px;
  }

  
  
  .gradeInputView-table-actions {
		padding-top: 1rem;
		display: flex;
	}
	.gradeInputView-table-actions button {
		border: 0;
    color: white;
    box-shadow: none;
    max-width: 200px;
    min-width: 150px;
    margin-right: 1rem;
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







  @media (max-width: 500px) {
    .modal-content {
      max-width: 450px;
    }
  }
`;