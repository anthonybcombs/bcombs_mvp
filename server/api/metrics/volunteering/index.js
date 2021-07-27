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
        const { id, year, grade } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('grade ', grade);
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01'; 
        let dtNext = new Date(dtNextText);

        let queryParam = [dtLast, dtNext];
        let gradeQualifier = '';
        if (grade > 8) {
            gradeQualifier = "where b.grade_number = ? ";
            queryParam.push(grade);
        }
        else if (grade > 5) {
            gradeQualifier = "where b.grade_number in ( '6', '7', '8' )";
        }

        let query = 
            "select a2.sum_volunteer_hours as volunteer_hours, " + 
                "b.ch_id " + 
            "from child b " + 
            "inner join ( " + 
                "Select a.child_id, SUM(a.volunteer_hours) as sum_volunteer_hours " + 
                "from attendance a " + 
               "where a.attendance_date >= ? and a.attendance_date < ? " +
                "Group by a.child_id " +
            ") as a2 on b.ch_id = a2.child_id " + gradeQualifier;
        console.log('Query ', query);
        const response =  await db.query(query, queryParam);
        console.log('Volunteering ', response);

        let buckets = [ "No Volunteering", "0-10 Hours", "10-40 Hours", "More than 40 Hours" ];

        let series = [];
        for (let i=0; i<response.length; i++) {
            let row = response[i];
            if (row.volunteer_hours == 0) {
                series = addToSeries(series, buckets[0]);
                continue;
            }
            if (row.volunteer_hours < 10) {
                series = addToSeries(series, buckets[1]);
                continue;
            }
            if (row.volunteer_hours < 40) {
                series = addToSeries(series, buckets[2]);
                continue;
            }
            series = addToSeries(series, buckets[3]);
        }

        let returnData = [];
        for (let j=0; j < buckets.length; j++) {
            if (series[buckets[j]]) returnData.push(series[buckets[j]]);
        }

        res.status(200).json({ volunteeringInYear: returnData });
    } catch (error) {

    }
});

export default router;