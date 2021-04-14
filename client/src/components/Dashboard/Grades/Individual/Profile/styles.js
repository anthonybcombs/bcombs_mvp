import styled from "styled-components";

export default styled.div`
  width: auto;
	max-width: 1920px;
	margin: auto;
  padding: 0rem 3em 2rem;

	#gradesAndTracking {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
    min-height: calc(100vh - 220px);
  }

	#gradesAndTracking .content {
		display: flex;
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