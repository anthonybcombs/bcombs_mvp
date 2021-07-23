import React, { useEffect, useState } from 'react'

import Charts from './Charts';

const Mentees = props => {
    const { auth } = props;
    const [tempData, setTempData] = useState([]);

    useEffect(() => {
        setTempData([1, 2, 3, 4, 5]);
    }, []);




    //let x = 5;
    //var Highcharts = require('highcharts');  
    // Load module after Highcharts is loaded
    //require('highcharts/modules/exporting')(Highcharts);  

    return <div style={{ padding: 24 }}>
        <h4>Mentee / Year</h4>
        <Charts data={tempData} chartType="bar" title="Mentees" />
    </div>
}

export default Mentees;