import styled from "styled-components";
// import ProfileBackground from "../../../../images/defaultprofile.png"
import ProfileBackground from "../../../../../images/profile-bg.png"


export default styled.div`
  width: auto;
	max-width: 1920px;
	margin: auto;
  padding: 0rem 3em 2rem;

	#gradesAndTracking {
    // padding: 1rem;
    // background-color: white;
    // box-shadow: 0 0 25px #eae9e9;
    min-height: calc(100vh - 220px);
  }

	#gradesAndTracking .content {
		display: grid;
    grid-gap: 1rem;
    grid-template-columns: 260px 1fr;

		min-height: calc(100vh - 220px);
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


	#gradesAndTracking .content .left {
    padding: 1rem;
		background: #fff;
		box-shadow: 0 0 25px #eae9e9;
	}

	.profile {
		padding: 1rem;
    height: 200px;
		margin: -1rem -1rem 1rem;

		display: flex;
    flex-direction: column;

    background-size: cover;
		background-position: center bottom;
		background-image: url("${ProfileBackground}");
	}
	.profile img {
    display: flex;
    margin: auto;
		width: 100%;
    max-width: 130px;
    border-radius: 100px;
    box-shadow: 0 3px 6px rgb(0 0 0 / 25%);
	}

	.profile .profile-name {
    color: #fff;
    padding: 1rem;
		font-size: 18px;
		text-align: center;
    text-shadow: 0 1px 6px rgb(0 0 0 / 15%);
	}
	
	.customLink {
		text-align: center;
    border-radius: 3px;
		background: #FBC00F;
		padding: .65rem .5rem;
	}
	.customLink a {
		color: #000;
		text-decoration: none;
	}

	.Collapsible {
		margin-top: 1rem;
    padding-top: 1rem;
		border-top: 1px solid #d6d6d6;
	}
	.Collapsible .Collapsible__trigger .CollapsibleHeader {
		display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;
		transition: .15s ease-in-out;
	}
	.Collapsible .Collapsible__trigger .CollapsibleHeader:hover {
		opacity: .65;
	}
	.Collapsible .Collapsible__trigger .CollapsibleHeader span {
		font-size: 20px;
	}
	.Collapsible .CollapsibleContent {
		padding-top: .5rem;
	}
	.Collapsible .CollapsibleContent .CollapsibleContentList {
		padding: .5rem 0;
		display: grid;
    grid-template-columns: 1fr 1fr;
	}
	.Collapsible .CollapsibleContent .CollapsibleContentList p {
		margin: 0;
	}
	.Collapsible .CollapsibleContent .CollapsibleContentList .label {
		font-weight: bold;
	}
	.Collapsible .CollapsibleContent .CollapsibleContentList .value {
		font-weight: 100;
		color: #464545;
	}




	.rightContainer {
		padding: 1rem;
		margin-bottom: 1rem;
    background: #fff;
    box-shadow: 0 0 25px #eae9e9;
	}
	.rightContainer:last-child {
		margin-bottom: 0;
	}

	.rightContainer .rightContainerHeader {
		font-size: 1.2em;
    margin: 0 0 1rem;
	}

	.tableWrapper {
		height: 100%;
    overflow-x: auto;
		overflow-y: unset;
    // min-height: calc(100vh - 400px);
		min-height: calc(100vh - 700px);
    max-height: 250px;

		max-width: calc(100vw - 400px);
  }
	.tableWrapper::-webkit-scrollbar {
		width: 4px;
		height: 4px;
		opacity: 0;
		visibility: hidden;
	}
	.tableWrapper::-webkit-scrollbar-track {
		border-radius: 10px;
		transition: 0.5s ease-in-out;
		background: rgb(243 110 34 / 20%);
		opacity: 0;
		visibility: hidden;
	}
	.tableWrapper::-webkit-scrollbar-thumb {
		background: #f36e22;
		border-radius: 10px;
		opacity: 0;
		visibility: hidden;
	}
	.tableWrapper:hover ::-webkit-scrollbar,
	.tableWrapper:hover ::-webkit-scrollbar-track,
	.tableWrapper:hover ::-webkit-scrollbar-thumb {
		opacity: 1;
		visibility: visible;
	}



	.profileTrackingTable {
		text-align: center;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 0;
	}

	.profileTrackingTable thead tr:last-child th {
		position: sticky;
		top: -1px;
		z-index: 10;
	}
	.profileTrackingTable th:not(:last-child) {
		position: relative;
		border-right: 1px solid rgb(255 255 255 / 65%);
	}

	.profileTrackingTable thead tr:nth-child(2) {
		border-top: 1px solid #c0caec;
	}

	.profileTrackingTable thead tr:nth-child(2) th:nth-child(1) {
		min-width: 35px;
	}

	.profileTrackingTable thead tr:nth-child(2) th >svg {
		position: relative;
    right: -5px;
		cursor: pointer;
    transition: .15s ease-in-out;
	}

	.profileTrackingTable thead tr:nth-child(2) th >svg:hover {
		opacity: 0.5;
	}

	.profileTrackingTable td,
	.profileTrackingTable th {
		border: 0;
		padding: 12px 3px;
	}

	.profileTrackingTable tr:nth-child(even) {
		background-color: #f9f9f9;
	}

	.profileTrackingTable th {
		color: white;
		text-align: center;
		background-color: #4B68C5;
		// min-width: 120px;
		min-width: 80px;
	}



	.gradeLevelTable th {
		background: #f26e21;
	}

	.individualGradesTable thead tr:first-child th {
		color: #000;
		text-align: left;
		background: #fbc00f;
	}

	.individualGradesTable thead tr:last-child {
		border-top: 1px solid #fff;
	}
	.individualGradesTable thead tr:last-child th {
		color: #000;
		background: #FFE391;
	}







  @media (max-width: 840px) {
		padding: 0rem 1rem 2rem;

		.tableWrapper {
			max-width: calc(100vw - 340px);
		}
	}
	@media (max-width: 600px) {
		#gradesAndTracking .content {
			display: block;
		}
		#gradesAndTracking .content .left {
			margin-bottom: 1rem;
		}
		.tableWrapper {
			max-width: unset;
		}
	}

`;