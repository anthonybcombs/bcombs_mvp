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
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            }
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
                if (gradeNum <= 8) {
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
        <div className="grid grid-2b">
        <div className="top-left"><h4>Mentee / Year</h4></div>
        <div className="top-right"><button id="exportButton"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" class="svg-inline--fa fa-download fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg><span>Export</span></button></div>
        </div>
        <Charts optionsData={tempOptionsData} />
    </div>
}

export default Mentees;