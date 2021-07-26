import React from 'react';

const MetricMenu = props => {
    const { handleSelectedLabel, selectedLabel } = props;
    return <div>
        <div id="metrics-page-menu-wrapper">
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <h3>Reports</h3>
            <div
                className={`${selectedLabel === "attendance" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("attendance");
                }}
            >
                <span>Attendance</span>
            </div>
            <div
                className={`${selectedLabel === "mentees" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("mentees");
                }}
            >
                <span>Mentee / Year</span>
            </div>
            <div
                className={`${selectedLabel === "tests" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("tests");
                }}
            >
                <span>Standardized Tests</span>
            </div>
            <div
                className={`${selectedLabel === "grades" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("grades");
                }}
            >
                <span>On Track/ Off Track</span>
            </div>
            <div
                className={`${selectedLabel === "mentoring" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("mentoring");
                }}
            >
                <span>Mentoring</span>
            </div>
            <div
                className={`${selectedLabel === "volunteer_hours" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("volunteer_hours");
                }}
            >
                <span>Volunteer Hours</span>
            </div>

        </div>
    </div>
}

export default MetricMenu;