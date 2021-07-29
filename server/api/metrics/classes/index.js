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
        const { id, year, vendorId } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('vendor ', vendorId );
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01'; 
        let dtNext = new Date(dtNextText);

        let queryParam = [dtLast, dtNext];

        let query = 
            "select a2.sum_mentoring_hours as mentoring_hours, " + 
                "b.ch_id " + 
            "from child b " + 
            "inner join ( " + 
                "Select a.child_id, SUM(a.mentoring_hours) as sum_mentoring_hours " + 
                "from attendance a " + 
               "where a.attendance_date >= ? and a.attendance_date < ? " +
                "Group by a.child_id " +
            ") as a2 on b.ch_id = a2.child_id ";
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

        res.status(200).json({ classData: returnData });
    } catch (error) {

    }
});

export default router;