import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    const loadDataForYear = async (db, vendorId, grade, testName, year) => {
        let response = null
        try {
            let dtLastTxt = '' + (year - 1) + '-08-01';
            let dtNextTxt = '' + year + '-08-01'; 
     
            let queryParam = [vendorId, testName, dtLastTxt, dtNextTxt];
            console.log('param: ', queryParam);
     
             let gradeTable = '';
             let gradeQualifier = '';
             if (grade > 8) {
                 gradeTable = ", child d ";
                 gradeQualifier = "and d.grade_number = ? and c.child_id = d.ch_id ";
                 queryParam.push(grade);
             }
             else if (grade > 5) {
                 gradeTable = ", child d ";
                 gradeQualifier = "and d.grade_number in ( '6', '7', '8' ) and c.child_id = d.ch_id ";
             }
     
            let query = 
                 "SELECT AVG(score) as avgScore " + 
                 "FROM vendor a, application b, student_standardized_test c " + gradeTable +
                 "where a.id2 = ? and b.vendor = a.id and c.child_id = b.child " +
                     "and c.test_name = ? " +
                     "and c.month_taken >= ? and c.month_taken < ? " + gradeQualifier; 
            console.log('Average Standardized Test Query ', query);
            response =  await db.query(query, queryParam);
     
        }
        catch (error) {
            console.log("error: ", error);
        }
        return (response && response.length > 0) ? response[0].avgScore : 0;
    }


    try {
        const { id, grade, vendorId, testName } = req.body;
        const db = makeDb();

        let returnData = [];
        for (let year=2020; year < 2023; year++) {
            let averageScore = await loadDataForYear(db, vendorId, grade, testName, year);
            returnData.push(averageScore ? averageScore : 0);
        }

        console.log('tests', returnData);
        res.status(200).json({ avgTestResults: returnData });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;