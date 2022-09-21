import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
// import { useSelector } from "react-redux";
// import { uuid } from "uuidv4";
// import { getHours, max } from "date-fns";

const DefaultVendorSummaryStyled = styled.div`
  #application-status {
    padding: 1em;
  }

  #application-status-header {
    font-size: 1.2em;
  }

  #application-status-header > div {
    padding: 1em 0;
  }

  #application-status-header > div > span {
    font-weight: normal;
  }

  #application-status-header > div > svg {
    color: #D33125;
  }

  #application-status-list {
    box-shadow: 0px 0px 10px #ccc;
  }

  #groups {
    text-align: center;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    border: 0;
  }
  
  #groups td, #groups th {
    border: 0;
    padding: 15px;
  }
  
  #groups tr:nth-child(odd){background-color: #f9f9f9;}
  
  // #groups tr:hover {background-color: #ddd;}
  
  #groups th {
    text-align: center;
    background-color: #f26e21;
    color: white;
  }

  #groups a {
    color: #3e89fe;
    text-decoration: none;
  }
`;


const getDefaultVendorSummary = async () => {

    const response = await fetch(`${process.env.API_HOST}/api/vendor/default/summary`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer'

    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const getFormattedAppGroups = appGroups => {
    return appGroups && appGroups.reduce((accum, item) => {
        if (item.name.includes('Freshman')) {
            return {
                ...accum,
                freshman: item.app_grp_id
            }
        }
        else if (item.name.includes('Sophomore')) {
            return {
                ...accum,
                sophomore: item.app_grp_id
            }
        }
        else if (item.name.includes('Junior')) {
            return {
                ...accum,
                junior: item.app_grp_id
            }
        }
        return {
            ...accum,
            senior: item.app_grp_id
        }
    }, {});
}

export default function index({
    vendors = [],
    form = {},
    //   isForm = false
}) {

    const [chapters, setChapters] = useState([]);
    // const [applications, setApplications] = useState([]);


    useEffect(() => {
        const triggerApi = async () => {
            try {
                const response = await getDefaultVendorSummary();
                if (response?.data) {
                    const applications = response.data;
                    let chapterWithApplications = vendors.map(chapter => {
                        const appGroups = getFormattedAppGroups(chapter?.app_groups || [])
                        const chapterApplications = applications.filter(app => app.vendor === chapter.id);

                        // console.log('testttttttttttt', chapterApplications.filter(item => item.class_teacher('b8ecfe20-09d4-11ed-9ebd-72ed28470cb')))
                        const counts = chapterApplications.reduce((accum, item) => {
                            if (item.class_teacher) {
                                if (item.class_teacher.includes(appGroups.freshman)) {
                                    return {
                                        ...accum,
                                        freshman: accum.freshman + 1,
                                        total: accum.total + 1
                                    }
                                }
                                else if (item.class_teacher.includes(appGroups.sophomore)) {
                                    return {
                                        ...accum,
                                        sophomore: accum.sophomore + 1,
                                        total: accum.total + 1
                                    }
                                }
                                else if (item.class_teacher.includes(appGroups.junior)) {
                                    return {
                                        ...accum,
                                        junior: accum.junior + 1,
                                        total: accum.total + 1
                                    }
                                }
                                else if (item.class_teacher.includes(appGroups.senior)) {
                                    return {
                                        ...accum,
                                        senior: accum.senior + 1,
                                        total: accum.total + 1
                                    }
                                }

                            }
                            return {
                                ...accum,
                                no_groups: accum.no_groups + 1,
                                total: accum.total + 1
                            }
                        }, {
                            freshman: 0,
                            sophomore: 0,
                            junior: 0,
                            senior: 0,
                            no_groups: 0,
                            total:0
                        });

                        return {
                            applications: chapterApplications,
                            counts,
                            ...chapter,
                        }

                    }).filter(item => item.name.includes('LOT®'));

                    console.log('chapterWithApplications chapterWithApplications',chapterWithApplications)
                    const overallChapters = chapterWithApplications.reduce((accum,item) => {
                        return {
                            ...accum,
                            counts:{
                                freshman:  accum.counts.freshman + item.counts.freshman,
                                sophomore:  accum.counts.sophomore + item.counts.sophomore,
                                junior: accum.counts.junior + item.counts.junior,
                                senior: accum.counts.senior + item.counts.senior,
                                no_groups: accum.counts.no_groups + item.counts.no_groups,
                                total: accum.counts.total + item.counts.total
                            }
                        }
                    },{
                        name: 'All',
                        counts:{
                            freshman: 0,
                            sophomore: 0,
                            junior: 0,
                            senior: 0,
                            no_groups: 0,
                            total:0
                        }
                    })
                    console.log('chapterWithApplications overallChapters',overallChapters)

                    setChapters([overallChapters,...chapterWithApplications])
                }

            } catch (e) {
                console.log('Error', e)
            }
        };

        if (vendors.length > 0) {
            triggerApi();
        }

    }, [vendors]);


    const renderTableData = () => {

        if (chapters.length > 0) {
            return chapters.map((chapter, index) => {
                return <tr key={index}>
                    <td>
                        {chapter.name}
                    </td>
                    <td>{chapter?.counts?.total || '-'}</td>
                    <td>{chapter?.counts?.freshman || '-'}</td>
                    <td>{chapter?.counts?.sophomore || '-'}</td>
                    <td>{chapter?.counts?.junior || '-'}</td>
                    <td>{chapter?.counts?.senior || '-'}</td>
                    <td>{chapter?.counts?.no_groups || '-'}</td>
                </tr>
            })
        } else {
            return (<tr></tr>)
        }

    }

    return (
        <DefaultVendorSummaryStyled>
            <div id="application-status">
                <div id="application-status-header">
                    {/* <div>              
            <span>Overall Summary</span>
          </div> */}
                </div>

                <div id="application-status-list">
                    <table id="groups">
                        <tbody>
                            <tr>
                                <th>Chapter</th>
                                <th>Total</th>
                                <th>Freshman</th>
                                <th>Sophomore</th>
                                <th>Junior</th>
                                <th>Senior</th>
                                <th>No Group</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {renderTableData()}
                        </tbody>
                    </table>
                </div>

            </div>
        </DefaultVendorSummaryStyled>
    )
}