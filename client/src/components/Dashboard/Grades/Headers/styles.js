import styled from "styled-components";

export default styled.div`
  display: flex;
  align-items: flex-end;
  flex: 1;

  .field {
		padding: 0;
		margin: 0;
		display: flex;
		flex-flow: column-reverse;
	}
	.field-input {
		font-size: 18px;
		border: 0;
		border-bottom: 1.65px solid #ccc;
		font-family: inherit;
		-webkit-appearance: none;
		-moz-appearance: none;
		border-radius: 0;
		padding: 5px;
		cursor: text;
		line-height: 1.8;

		padding: 5px 0;
		width: 100%;
		display: block;
		text-indent: 5px;
	}
	.field-input:placeholder-shown + .field-label {
		max-width: calc(100% - 30%) !important;
	}
	.field-label,
	.field-input {
		transition: all 0.2s;
		touch-action: manipulation;
	}
	.field-label {
		font-size: 14px;
		color: #4b525a;
	}
	.field-input:placeholder-shown + .field-label {
		overflow: hidden;
		transform-origin: left bottom;
		transform: translate(0, 2.125rem) scale(1.4);
	}
	.field-input::placeholder {
		opacity: 0;
		transition: inherit;
		font-size: 12px;
	}
	.field-input:focus::placeholder {
		opacity: 1;
	}
	.field-input:focus + .field-label {
		transform: translate(0, 0) scale(1);
		cursor: pointer;
		font-weight: bold;
  }
  
  .search-input {
    position: relative;
    max-width: 300px;
    width: 100%;
    margin: 0 auto;
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
`;