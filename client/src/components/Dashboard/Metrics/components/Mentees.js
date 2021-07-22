import React, { useEffect, useState } from 'react'


const Mentees = props => {
    const { auth } = props;
    const [tempData, setTempData] = useState(null);
    useEffect(() => {
        setTempData('{ series: [{ data: [1,2,3,4,5] }]}');
    });

    //let x = 5;
    //var Highcharts = require('highcharts');  
    // Load module after Highcharts is loaded
    //require('highcharts/modules/exporting')(Highcharts);  
        return <div style={{ padding: 24 }}>
        <h4>Mentee / Year</h4>
        <div id="chart-wrapper">
            <div>{tempData}</div>
        </div>
        <script>
            Highcharts.chart('chart-wrapper', {tempData});
        </script>
        </div>
}

export default Mentees;