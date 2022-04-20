import express from "express";

import { makeDb } from "../../../helpers/database";
import { getFormsByVendorId, getSQLClauseForAttendanceAndClassData } from "../form_and_class_queries";

const router = express.Router();


router.post("/", async (req, res) => {

    const addSessionToResults = (sessionData, results) => {
        let currentClassData = results['id_' + sessionData.class_id];
        if (!currentClassData)
            return results;
        if (!currentClassData.numSessions) {
            currentClassData.numSessions = 0;
            currentClassData.avgAttendance = 0;
        }
        let totalAttendance = 
            currentClassData.numSessions * currentClassData.numStudentsInClass * currentClassData.avgAttendance + 
            sessionData.numAttended;
        currentClassData.numSessions++;
        currentClassData.avgAttendance = totalAttendance / (currentClassData.numSessions * currentClassData.numStudentsInClass);
        results['id_' + sessionData.class_id] = currentClassData;
        return results;
    }
    const addStudentDataToResults = (studentData, results) => {
        let currentClassData = results['id_' + studentData.class_id];
        if (!currentClassData)
            return results;
        if (!currentClassData.attendanceBuckets) {
            currentClassData.attendanceBuckets = [
                { name: '0-50% of time', y: currentClassData.numStudentsInClass},
                { name: '51-75% of time', y: 0},
                { name: '76-85% of time', y: 0},
                { name: '86-100% of time', y: 0}
            ];
        }
        const studentAttendanceRate = studentData.numAttended / currentClassData.numSessions;
        if ( studentAttendanceRate <= 0.5) {
            return results;
        }
        currentClassData.attendanceBuckets[0].y--;
        if ( studentAttendanceRate <= 0.75) {
            currentClassData.attendanceBuckets[1].y++;
        }
        else if (studentAttendanceRate <= 0.85) {
            currentClassData.attendanceBuckets[2].y++;
        }
        else {
            currentClassData.attendanceBuckets[3].y++;
        }
        results['id_' + studentData.class_id] = currentClassData;
        return results;
    }
    
    try {
        const { id, year, vendorId, formId, lotVendorIds } = req.body;
        const db = makeDb();
        console.log('year ', year);

        let formArray = await getFormsByVendorId(db, vendorId);
        if (!formArray.length) {
            res.status(200).json({ classStats: [], formArray: [] });
            return;
        }
        /*
        let queryFormFormIds =
            "select BIN_TO_UUID(vca.form_id) as formId, vca.form_name from vendor_custom_application as vca, vendor v " +
            "where vca.vendor=v.id AND v.id2=? and vca.status <> 'deleted' " + 
            "order by vca.form_name;";
        let queryFormFormIdsParam = [vendorId];
        const response0 =  await db.query(queryFormFormIds, queryFormFormIdsParam);
        //console.log('Students per session: ', response);
        if (!response0 || response0.length == 0) {
            res.status(200).json({ classStats: [], formArray: [] });
            return;
        }

        let formArray = [{key: 'fid_0', name: 'BCombs Form'}];
        for (let r0 = 0; r0 < response0.length; r0++) {
            formArray.push({key: response0[r0].formId, name: response0[r0].form_name });
        }
        */

        let queryGroup = getSQLClauseForAttendanceAndClassData(year, vendorId, formId, lotVendorIds);
        let getClassesTableQuery = queryGroup.query;
        let queryParamForClassesQuery = queryGroup.param;

        /*
        let getClassesTableQuery =
            "From attendance a2, vendor b2, vendor_app_groups c2 " +
            "where a2.attendance_date >= ? and a2.attendance_date < ? and " + 
                "b2.id2 = ? and c2.vendor = b2.id and " + 
                "a2.app_group_id = c2.app_grp_id ";
        
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtNextTxt = '' + year + '-08-01'; 
        let queryParamForClassesQuery = [dtLastTxt, dtNextTxt, vendorId];

        if (formId != 'fid_0') {
            getClassesTableQuery =
                "From attendance a2, vendor_app_groups c2 " +
                "where a2.attendance_date >= ? and a2.attendance_date < ? and " + 
                    "c2.form = UUID_TO_BIN(?) and " +
                    "a2.app_group_id = c2.app_grp_id ";
            queryParamForClassesQuery = [dtLastTxt, dtNextTxt, formId];
        }
        */

        //let queryStudentPerClassParam = [dtLastTxt, dtNextTxt, vendorId];
        let queryStudentsPerClass = 
         "SELECT count(c.app_grp_id) as numStudentsInClass, a.class_id, a.class_name " + 
         "FROM vendor_app_groups_to_student c " +
             "inner join ( " +
                 "Select distinct(c2.app_grp_id) as app_group_id, c2.id as class_id, c2.name as class_name " +
                 getClassesTableQuery +
                 "group by c2.app_grp_id, c2.id " +
             ") as a " +
            "on a.app_group_id = c.app_grp_id " +
         "where c.app_grp_id = a.app_group_id group by c.app_grp_id";
 
         //console.log('Query ****> ', queryStudentsPerClass);
         //console.log('Q Param -> ', queryParamForClassesQuery);
         const response =  await db.query(queryStudentsPerClass, queryParamForClassesQuery);
         console.log('Students per class: ', response);
         if (!response || response.length == 0) {
             res.status(200).json({ classStats: [], classList: [{key: 'id_none', name: 'No classes For Form'}], formArray: formArray });
             return;
         }
  
         let resultData = {};
         for (let i=0; i < response.length; i++) {
            let row = response[i];
            resultData['id_' + row.class_id] = row;
        }
 
        //let queryStudentsPerSessionParam = [dtLastTxt, dtNextTxt, vendorId];
        let queryStudentsPerSession = 
            "Select count(*) as numAttended, c2.id as class_id, c2.name as class_name " +
            getClassesTableQuery +
                 "and a2.attendance_status <> 'Absent' " +
            "group by c2.id, c2.name, a2.attendance_date, a2.attendance_start_time " +
            "order by c2.id";

       // console.log('Query ', queryStudentsPerSession);
        const response2 =  await db.query(queryStudentsPerSession, queryParamForClassesQuery);
        //console.log('Students per session: ', response);
        if (!response2 || response2.length == 0) {
            res.status(200).json({ classStats: [], formArray: formArray });
            return;
        }
    
        for (let i=0; i < response2.length; i++) {
            let row = response2[i];
            resultData = addSessionToResults(row, resultData);
        }
     
     //get how many sessions each student attended
        //let querySessionsPerStudentParam = [dtLastTxt, dtNextTxt, vendorId];
        let querySessionsPerStudent = 
            "Select c2.id as class_id, c2.name as class_name, COUNT(child_id) as numAttended  " +
            getClassesTableQuery +
                "and a2.attendance_status <> 'Absent' " +
            "group by c2.id, a2.child_id";

        console.log('Query222 ', querySessionsPerStudent);
        console.log('Query222 queryParamForClassesQuery', queryParamForClassesQuery);
        const response3 =  await db.query(querySessionsPerStudent, queryParamForClassesQuery);
        //console.log('Sessions per student: ', response);
        if (!response3 || response3.length == 0) {
            res.status(200).json({ classStats: [], formArray: formArray });
            return;
        }
    
        for (let i=0; i < response3.length; i++) {
            let row = response3[i];
            resultData = addStudentDataToResults(row, resultData);
        }

        //get how many sessions each student attended
        /*
        let queryTotalStudentsParam = [dtLastTxt, dtNextTxt, vendorId];
        let queryTotalStudents = 
            "Select COUNT(child_id) as numStudents  " +
            "From attendance a2, vendor b2, vendor_app_groups c2 " +
            "where a2.attendance_date >= ? and a2.attendance_date < ? and " + 
                "a2.attendance_status <> 'Absent' and " +
                "b2.id2 = ? and c2.vendor = b2.id and " + 
                "a2.app_group_id = c2.app_grp_id " +
            "group by a2.child_id";

       // console.log('Query ', queryTotalStudents);
        const response4 =  await db.query(queryTotalStudents, queryTotalStudentsParam);
        //console.log('Total students: ', response4);
        if (!response4 || response4.length == 0) {
            res.status(200).json({ classStats: [] });
        }
        */

        let allClassRow = {
            class_id: 0,
            class_name: 'All Groups',
            numStudentsInClass: 0, //response4[0].numStudents,
            numSessions: 0,
            avgAttendance: 0,
            attendanceBuckets: [
                { name: '0-50% of time', y: 0},
                { name: '51-75% of time', y: 0},
                { name: '76-85% of time', y: 0},
                { name: '86-100% of time', y: 0}
            ]
        }
        let totalAvgAttendance = 0;
        let classList = [];
       
        for (let key in resultData) {
            if (key.indexOf('id_') < 0)
                continue;
            let row = resultData[key];

            allClassRow.numSessions += row.numSessions;
            totalAvgAttendance += (row.avgAttendance * row.numSessions);
            for (let j=0; j < allClassRow.attendanceBuckets.length; j++) {
                if(row.attendanceBuckets) {
                    let bucketCnt = row.attendanceBuckets[j].y;
                    if (!bucketCnt)
                        continue;
                    allClassRow.attendanceBuckets[j].y += bucketCnt;
                }
         
            }
            classList.push({key: 'id_' + row.class_id, name: row.class_name});
        }
        for (let i=0; i<allClassRow.attendanceBuckets.length; i++) {
            allClassRow.numStudentsInClass += allClassRow.attendanceBuckets[i].y;
        }
        allClassRow.avgAttendance = totalAvgAttendance / allClassRow.numSessions;
        resultData['id_' + 0] = allClassRow;

        classList.sort((a, b) => {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
        });
        //put all entry at top of list
        classList.unshift({key:'id_' + allClassRow.class_id, name: allClassRow.class_name});
        
        //console.log("**result data: ", resultData);
        //console.log("classList: ", classList);

        res.status(200).json({ classStats: resultData, classList: classList, formArray: formArray });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {
        console.log("ERROR-----> ", error);
        res.status(200).json({ classStats: [] });
    }
});

export default router;