import express from "express";

import { makeDb } from "../../../helpers/database";
import { getFormsByVendorId, 
    getClassesWithAttendanceByYearAndVendorAndFormId,
    getSQLClauseForAttendanceAndClassData,
    addToSeries } from "../form_and_class_queries";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, grade, vendorId, formId, classId, lotVendorIds } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('grade ', grade);

        let formArray = await getFormsByVendorId(db, vendorId);
        if (!formArray.length) {
            res.status(200).json({ volunteeringInYear: [], classList: [], formArray: [] });
            return;
        }
        console.log('getting class listtttttttt', formArray);

        let classList = await getClassesWithAttendanceByYearAndVendorAndFormId(db, year, vendorId, formId, lotVendorIds);
        if (!classList.length) {
            res.status(200).json({ volunteeringInYear: [], classList: [], formArray: formArray });
            return;
        }
        console.log('got class list');

        let queryGroup = getSQLClauseForAttendanceAndClassData(year, vendorId, formId, lotVendorIds);
        let getClassesTableQuery = queryGroup.query;
        let queryParam = queryGroup.param;

        /*
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01'; 
        let dtNext = new Date(dtNextText);
        */
        let classQualifier = '';
        if (classId && classId != 'id_0') {
            classQualifier = ' and c2.app_grp_id = UUID_TO_BIN(?) ';
            queryParam.push(classId);
        }

        let gradeQualifier = '';
        if (grade > 8) {
            gradeQualifier = "where b.grade_number = ? ";
            queryParam.push(grade);
        }
        else if (grade > 5) {
            gradeQualifier = "where b.grade_number in ( '6', '7', '8' )";
        }

        let query = 
            "select a.sum_mentoring_hours as mentoring_hours, " + 
                "b.ch_id " + 
            "from child b " + 
            "inner join ( " + 
                "Select a2.child_id, SUM(a2.mentoring_hours) as sum_mentoring_hours " + 
                getClassesTableQuery + classQualifier +
                "Group by a2.child_id " +
            ") as a on b.ch_id = a.child_id " + gradeQualifier;
        console.log('Query ', query);
        const response =  await db.query(query, queryParam);
        console.log('Mentoring ', response);

        let buckets = [ "No Mentoring", "0-10 Hours", "10-40 Hours", "More than 40 Hours" ];

        let series = [];
        for (let i=0; i<response.length; i++) {
            let row = response[i];
            if (row.mentoring_hours == 0) {
                series = addToSeries(series, buckets[0]);
                continue;
            }
            if (row.mentoring_hours < 10) {
                series = addToSeries(series, buckets[1]);
                continue;
            }
            if (row.mentoring_hours < 40) {
                series = addToSeries(series, buckets[2]);
                continue;
            }
            series = addToSeries(series, buckets[3]);
        }

        let returnData = [];
        for (let j=0; j < buckets.length; j++) {
            if (series[buckets[j]]) returnData.push(series[buckets[j]]);
        }

        res.status(200).json({ mentoringInYear: returnData, formArray: formArray, classList: classList });
    } catch (error) {

    }
});

export default router;