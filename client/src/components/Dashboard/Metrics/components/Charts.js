import React, { useState, useEffect } from 'react';

// CHART LIBRARY
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Charts = props => {
    const { data = [], chartType = 'bar', title = '' } = props;
    const [ chartData, setChartData ] = useState([]);

    useEffect(() => {
        if (data) {
            setChartData(data);
        }

    }, [data]);


    return (
        <div>

            <HighchartsReact
                highcharts={Highcharts}
                options={{
                    title: {
                        text: title
                    },
                    chart: {
                        type: chartType, // options: pie, bar, line
                    },
                    series: [{
                        data: chartData
                    }]
                }}
            />
        </div>
    )
}

export default Charts;