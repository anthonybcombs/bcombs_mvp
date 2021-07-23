import React, { useEffect, useState } from 'react'

import Charts from './Charts';

const apiCall2 = async (id, year) => {

    // Default options are marked with *
    const response = await fetch('http://localhost:3001/api/metrics/mentee', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            'id': id,
            'year': year
        }) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const Mentees = props => {
    const { auth } = props;
    const [tempOptionsData, setTempOptionsData] = useState([]);

    const triggerApi2 = async (id, year) => {
        try {
            const res = await apiCall2(id, year);
            console.log('apiCall mentee ', res)
            if (res && res.menteePerYear) {
                //setCurrentUser(res.user);
                defineChart(res.menteePerYear);
            }
        } catch (err) {
            console.log('Error', err)
        }
    };

    const defineChart = (data) => {
        let chartOptions = {
            chart: {
                type: 'pie'
            },
            title : {
                text: ''
            },
            //tooltip: {
            //    pointFormat: '<span><b>{point.y}</b> ({point.percentage:.1f}%)</span>'
            //},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
        };
        chartOptions['series'] = [{
            name: 'Mentees',
            colorByPoint: true,
            data: []
            }];

        if (data && data.length > 0) {
            let data2 = [];
            let rowMiddleSchool = {name: "Middle School", y: 0};
            for (let i=0; i< data.length; i++) {
                let row = data[i];
                let gradeNum = parseInt(row.name, 10);
                if (gradeNum < 6) {
                    data2.push(row);
                    continue;
                }
                if (gradeNum < 8) {
                    rowMiddleSchool.y += row.y;
                    continue;
                }
                if (row.name == "12") row.name = "Senior";
                if (row.name == "11") row.name = "Junior";
                if (row.name == "10") row.name = "Sophmore";
                if (row.name == "9")  row.name = "Freshman";
                data2.push(row);
            }
            if (rowMiddleSchool.y > 0) {
                data2.push(rowMiddleSchool);
            }
            chartOptions['series'][0]['data'] = data2;
        }    
        setTempOptionsData(chartOptions);
    }

    useEffect(() => {
        //defineChart(null);
        if (auth && auth.user_id) {
            triggerApi2(auth.user_id, 2021)
        }
    }, [auth]);

    return <div style={{ padding: 24 }}>
        <h4>Mentee / Year</h4>
        <Charts optionsData={tempOptionsData} />
    </div>
}

export default Mentees;