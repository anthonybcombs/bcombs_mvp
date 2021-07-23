import React, { useState, useEffect } from 'react';

// CHART LIBRARY
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Charts = props => {
    const {
        optionsData = {}
    //    seriesData = [], chartType = 'bar', title = '', plotOptions = {} 
    } = props;
   // const [ chartSeriesData, setChartSeriesData ] = useState([]);
   // const [ chartPlotOptions, setChartPlotOptions ] = useState([]);
   const [ chartOptionsData, setChartOptionsData ] = useState([]);

    useEffect(() => {
        if (optionsData) {
            setChartOptionsData(optionsData);
        }

    }, [optionsData]);
    
    /*
    useEffect(() => {
        if (plotOptions) {
            setChartPlotOptions(plotOptions)
        }

    }, [plotOptions]);
*/

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={ optionsData }
            />
        </div>
    )
}

export default Charts;