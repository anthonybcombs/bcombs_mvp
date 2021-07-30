import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";

import Charts from './Charts';

const apiCallClassReportData = async (id, year, vendorId) => {
    
    // Default options are marked with *
    const response = await fetch(`${process.env.API_HOST}/api/metrics/classes`, {
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
            'year': year,
            'vendorId': vendorId
        }) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}




const ClassReports = props => {
    const { auth, vendors } = props;

    const [tempOptionsData, setTempOptionsData] = useState([]);
    const [year, setYear] = useState('2021');
    const [hasData, setHasData] = useState(false);
    const chart = useRef();

    const triggerApi2 = async (id, year, vendorsIn) => {
        try {
            if (!vendorsIn ||!vendorsIn.length) {
                defineChart(null);
                return;
            }
            const vendorId = vendorsIn[0].id2; //TODO: add support for user in multiple vendors
            const res = await apiCallClassReportData(id, year, vendorId);
            console.log('apiCall classes ', res)
            if (res && res.classData) {
                //setCurrentUser(res.user);
                defineChart(res.classData);
            }
            else {
                defineChart(null);
            }
        } catch (err) {
            console.log('Error', err)
        }
    };

    const exportChart = () => {
        console.log('chart',chart)
        if (chart && chart.current && chart.current.chart) {
            chart.current.chart.setTitle(
                {text: 'Mentee / Year : ' + year
                });
            chart.current.chart.exportChart({
                type:'application/pdf'
            });
            chart.current.chart.setTitle({text:''});
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
            name: 'Students',
            colorByPoint: true,
            data: []
            }];

        setHasData(data && data.length > 0);
        if (data && data.length > 0) {
            chartOptions['series'][0]['data'] = data;
        }    
        setTempOptionsData(chartOptions);
    }

    useEffect(() => {
        //defineChart(null);
        if (auth && auth.user_id) {
            setYear(2021);
            triggerApi2(auth.user_id, year, vendors);
        }
    }, [auth, vendors]);

    const yearChange =(event) => {
        setYear(event.target.value);
        console.log("event ", event);
        console.log("year3 ", event.target.value); // ;year);
        triggerApi2(auth.user_id, event.target.value, vendors);
    };
    console.log('vendors',vendors)
 
    return <div style={{ padding: 24 }}>
        <div className="grid grid-2b">
        <div className="top-left"><h4>Class Student Counts</h4><select id="mentee-year" onChange={yearChange} value={year}>
            <option name="2022">2022</option>
            <option name="2021" >2021</option>
            <option name="2020">2020</option>
            <option name="2019">2019</option>
            </select></div>
        <div className="top-right"><button onClick={exportChart} id="exportButton"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" className="svg-inline--fa fa-download fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg><span>Export</span></button></div>
        </div>
        {hasData === true && <Charts customRef={chart} optionsData={tempOptionsData} />}
        {hasData === false && <div><p></p><p>No Class Info for {year}</p></div>}
    </div>
}

export default ClassReports;