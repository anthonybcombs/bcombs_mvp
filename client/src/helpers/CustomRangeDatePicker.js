import React from 'react';
import styled from 'styled-components';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

const CustomRangeDatePickerStyled = styled.div`
	.react-datetimerange-picker,
	.react-date-picker,
	.react-time-picker {
		width: 100%;
	}
	.react-datetimerange-picker button,
	.react-date-picker button,
	.react-time-picker button {
		width: inherit;
		color: initial;
		background-color: initial;
		box-shadow: initial;
		border-radius: initial;
	}
	.react-datetimerange-picker,
	.react-date-picker,
	.react-time-picker {
		border: none;
		width: 100%;
		margin: 1em 0 1em 0;
	}
	.react-datetimerange-picker input,
	.react-date-picker input,
	.react-time-picker input {
		margin: 0;
		width: initial;
		border-bottom: none;
	}
	.react-datetimerange-picker__wrapper,
	.react-date-picker__wrapper,
	.react-time-picker__wrapper {
		border: none;
	}

	.react-calendar .react-calendar__tile--active,
	.react-calendar__tile--rangeStart {
		background-color: #f26e21 !important;
		color: white !important;
	}

	.react-datetimerange-picker__inputGroup__input--hasLeadingZero,
	.react-date-picker__inputGroup__input--hasLeadingZero,
	.react-time-picker__inputGroup__input--hasLeadingZero {
		padding: 0;
	}
	.react-date-picker__inputGroup__input,
	.react-time-picker__inputGroup__input,
	.react-datetimerange-picker__inputGroup__input {
		display: inline !important;
		transition: none !important;
	}

	.react-calendar__tile--active:enabled:focus {
		background-color: #f26e21;
		color: white;
	}
	input[placeholder='Add guests'] {
		display: inline-block;
		width: initial;
	}
	svg[class='react-datetimerange-picker__clear-button__icon react-datetimerange-picker__button__icon'] {
		display: none;
	}
	
	.react-datetimerange-picker .react-datetimerange-picker__calendar{
		top:100% !important;
	}

	
`;

const CustomRangeDatePicker = ({
  value,
  onChange,
  onCalendarClose
}) => {
	return (<CustomRangeDatePickerStyled>	
		<DateTimeRangePicker
				value={value}
				disableClock={true}
				rangeDivider={true}
     	 	onChange={onChange}
      	onCalendarClose={onCalendarClose}
		/>
	</CustomRangeDatePickerStyled>
	);
};

export default CustomRangeDatePicker;