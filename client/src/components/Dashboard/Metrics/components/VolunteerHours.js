import React, { useEffect, useState, useRef } from 'react'

import Charts from './Charts';

const apiCallVolunteering = async (id, year, grade) => {
    
    // Default options are marked with *
    const response = await fetch(`${process.env.API_HOST}/api/metrics/volunteering`, {
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
            'grade' : grade
        }) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}



const VolunteerHours = props => {
    const { auth } = props;
    const [tempOptionsData, setTempOptionsData] = useState([]);
    const [year, setYear] = useState('2021');
    const [grade, setGrade] = useState('all');
    const chart = useRef();

    useEffect(() => {
        if (auth && auth.user_id) {
            triggerApiCallVolunteering(auth.user_id, year, grade);
        }
    }, [auth]);

    const triggerApiCallVolunteering = async (id, year, grade) => {
        try {
            const res = await apiCallVolunteering(id, year, grade);
            console.log('apiCall volunteering ', res)
            if (res && res.volunteeringInYear) {
                defineChart(res.volunteeringInYear);
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
            chartOptions['series'][0]['data'] = data;
        }    
        setTempOptionsData(chartOptions);
    }

    const gradeDisplay = (grade) => {
        if (grade == "all") return '';
        if (grade == "12") return 'Seniors ';
        if (grade == "11") return 'Juniors ';
        if (grade == "10") return 'Sophmores ';
        if (grade == "9") return 'Freshmen ';
        if (grade == "8") return 'Middle Schoolers ';
        return '';
    }

    const exportChart = () => {
        console.log('chart',chart)
        if (chart && chart.current && chart.current.chart) {
            chart.current.chart.setTitle(
                {text: 'Volunteer Hours : ' + gradeDisplay(grade) + year
                });
            chart.current.chart.exportChart({
                type:'application/pdf'
            });
            chart.current.chart.setTitle({text:''});
        }
      };

    const yearChange =(event) => {
        setYear(event.target.value);
        console.log("event ", event);
        console.log("year2 ", event.target.value); // ;year);
        triggerApiCallVolunteering(auth.user_id, event.target.value, grade);
    };

    const gradeChange =(event) => {
        setGrade(event.target.value);
        console.log("event ", event);
        console.log("grade ", event.target.value); // ;grade);
        triggerApiCallVolunteering(auth.user_id, year, event.target.value);
    };

return <div style={{ padding: 24 }}>
        <div className="grid grid-2b">
            <div className="top-left">
                <h4>Volunteer Hours</h4>
            
                <select id="child-grade" onChange={gradeChange} value={grade}>
                    <option value="all">All</option>
                    <option value="12" >Seniors</option>
                    <option value="11">Juniors</option>
                    <option value="10">Sophmores</option>
                    <option value="9">Freshmen</option>
                    <option value="8">Middle School</option>
                    </select>
                <select id="mentee-year" onChange={yearChange} value={year}>
                    <option value="2022">2022</option>
                    <option value="2021" >2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    </select>
            </div>
            <div className="top-right"><button onClick={exportChart} id="exportButton"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" className="svg-inline--fa fa-download fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg><span>Export</span></button></div>
        </div>
        <Charts customRef={chart} optionsData={tempOptionsData} />
    </div>
}

export default VolunteerHours;