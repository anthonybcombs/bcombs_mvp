import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    const addToSeries = (series, key) => {
        let seriesKeyData = series[key];
        if (!seriesKeyData) {
            seriesKeyData = { name: key, y: 0};
        }
        seriesKeyData.y++;
        series[key] = seriesKeyData;
        return series;
    }

    try {
        const { id, year, grade, vendorId } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('grade ', grade);
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01'; 
        let dtNext = new Date(dtNextText);

        let queryParam = [dtLast, dtNext, vendorId];
        let gradeQualifier = '';
        if (grade > 8) {
            gradeQualifier = "where b.grade_number = ? ";
            queryParam.push(grade);
        }
        else if (grade > 5) {
            gradeQualifier = "where b.grade_number in ( '6', '7', '8' )";
        }

        let query = 
            "select a2.sum_mentoring_hours as mentoring_hours, " + 
                "b.ch_id " + 
            "from child b " + 
            "inner join ( " + 
                "Select a.child_id, SUM(a.mentoring_hours) as sum_mentoring_hours " + 
                "FROM attendance a, vendor b, vendor_app_groups c " + 
               "where a.attendance_date >= ? and a.attendance_date < ? " +
               "and b.id2 = ? and c.vendor = b.id and a.app_group_id = c.app_grp_id " +
                "Group by a.child_id " +
            ") as a2 on b.ch_id = a2.child_id " + gradeQualifier;
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

        res.status(200).json({ mentoringInYear: returnData });
    } catch (error) {

    }
});

export default router;