import React, { useEffect, useState, useRef } from 'react'

import Charts from './Charts';
import Loading from "../../../../helpers/Loading.js";

const apiCallClassAttendance = async (vendorId, id, year) => {
    
    // Default options are marked with *
    const response = await fetch(`${process.env.API_HOST}/api/metrics/class_attendance`, {
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
            'vendorId' : vendorId
        }) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const ClassAttendance = props => {
    const { auth, vendors } = props;
    const [tempOptionsData, setTempOptionsData] = useState([]);
    const [classList, setClassList] = useState([]);
    const [year, setYear] = useState('2021');
    const [classId, setClassId] = useState('id_0');
    const [classStatsData, setClassStatsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [subHeaderText, setSubHeaderText] = useState('');
    const chart = useRef();
    //hack because of weird bug
    const [allAttendanceBuckets, setAllAttendanceBuckets] = useState([]);

    useEffect(() => {
        if (auth && auth.user_id) {
            triggerApiCallAttendance(auth.user_id, year);
        }
    }, [auth, vendors]);
    console.log('vendors 2',vendors)

    const triggerApiCallAttendance = async (id, year) => {
        try {
            setSubHeaderText('');
            if (!vendors ||!vendors.length) {
                setIsLoading(false);
                defineChart(null);
                return;
            }
            setIsLoading(true);
            const vendorId = vendors[0].id2; 
            console.log("vendorId", vendorId)
            const res = await apiCallClassAttendance(vendorId, id, year);
            console.log('apiCall attendance ', res);
            if (res && res.classStats && res.classStats['id_0']) {
                let classIdLocal = classId;
                if (!res.classStats[classId]) {
                    setClassId('id_0');
                    classIdLocal = 'id_0';
                }
                if (!res.classList) {
                    setClassList([]);
                }
                else {
                    setClassList(res.classList);
                }
                console.log("classStats aaaaa: ", res.classStats);
                setClassStatsData(res.classStats);
                if (res.classStats["id_0"]) { //hack
                    setAllAttendanceBuckets([...res.classStats["id_0"].attendanceBuckets]);
                }
                setClassIdToValue(classIdLocal, res.classStats, res.classStats[classIdLocal].attendanceBuckets) 
            }
            else {
                defineChart(null);
            }
            setIsLoading(false);
        } catch (err) {
            console.log('Error', err)
        }
    };

    const defineChart = (attendanceBuckets) => {
        console.log("attendance breakout: ", attendanceBuckets)
        let chartOptions = {
            chart: {
                type: 'pie'
            },
            title : {
                text: 'Range of Student Attendance'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>', //: {point.percentage:.1f} %'
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

        if (attendanceBuckets && attendanceBuckets[0]) {
            console.log("&&&&&&&&&& setting series");
            chartOptions['series'][0]['data'] = [...attendanceBuckets];
        }    
        setTempOptionsData(chartOptions);
    }

    const exportChart = () => {
        console.log('chart',chart)
        if (chart && chart.current && chart.current.chart) {
            chart.current.chart.setTitle(
                {text: 'Class Attendance: ' + year
                });
            chart.current.chart.exportChart({
                type:'application/pdf'
            });
            chart.current.chart.setTitle({text:''});
        }
      };

    const yearChange =(event) => {
        setYear(event.target.value);
        console.log("year2 ", event.target.value); // ;year);
        triggerApiCallAttendance(auth.user_id, event.target.value);
    };

    const classChange =(event) => {
        console.log("----- Class Data: ", classStatsData);
        let classIdIn = event.target.value;
        let attendanceBucketsLocal = classStatsData[classIdIn].attendanceBuckets;
        if (classIdIn == "id_0") { //hack to fix weird bug
            console.log("---- hack value: ", allAttendanceBuckets);
            attendanceBucketsLocal = allAttendanceBuckets;
        }
        setClassIdToValue(classIdIn, classStatsData, attendanceBucketsLocal);
    };

    const setClassIdToValue = (classIdIn, classDataLocal, attendanceBucketsLocal) => {
        console.log("---- classStats local: ", classDataLocal, classIdIn);
        let classElem = classDataLocal[classIdIn]
        setSubHeaderText(
            ' Students: ' + classElem.numStudentsInClass +
            ' Sessions: ' + classElem.numSessions +
            ' Attendance Average: ' + parseFloat(classElem.avgAttendance * 100).toFixed(2)+'%');
        let attendanceCopy = [...attendanceBucketsLocal];
        defineChart(attendanceCopy);
        setClassId(classIdIn);
    }

    return <div style={{ padding: 24 }}>                
            <div className="grid grid-2b">
                <div className="top-left">
                    <h4>Attendance By Class</h4>
            
                    <select id="mentee-year" onChange={yearChange} value={year}>
                        <option value="2022">2022</option>
                        <option value="2021" >2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                    </select>
                    { isLoading ? ( <></>) : (
                    <select id="mentee-class" onChange={classChange} value={classId}>
                        { classList && classList.length > 0 && classList.map((elem) => 
                                <option value={elem.key} key={elem.key}>{elem.name}</option> 
                            )
                        }
                        </select>
                    )}

                </div>
                { isLoading ? ( <></>) : (<div className="top-right"><button onClick={exportChart} id="exportButton"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" className="svg-inline--fa fa-download fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg><span>Export</span></button></div>) }
            </div>
            { isLoading ? ( <></>) : (<h5 className="sub-header">{subHeaderText}</h5>) }
            { isLoading ? (<Loading />) : (<Charts customRef={chart} optionsData={tempOptionsData} />) }
        </div>
}

export default ClassAttendance;