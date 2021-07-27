import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, grade, vendorId } = req.body;
        const db = makeDb();
        let dtLastTxt = '' + (year - 1) + '-08-01';
       let dtNextTxt = '' + year + '-08-01'; 

       let queryParam = [vendorId, dtLastTxt, dtNextTxt];

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
            "SELECT SUM(IF(c.gpa_sem_1 <= 2.5, 1, 0)) as badSem1, SUM(IF(c.gpa_sem_1 > 2.5, 1, 0)) as goodSem1, " + 
                "SUM(IF(c.gpa_sem_2 <= 2.5, 1, 0)) as badSem2, SUM(IF(c.gpa_sem_2 > 2.5, 1, 0)) as goodSem2 " + 
            "FROM vendor a, vendor_app_groups b, student_grade_cumulative c " + gradeTable +
            "where a.id2 = ? and b.vendor = a.id and c.app_group_id = b.app_grp_id " +
                "and c.school_year_start >= ? and c.school_year_start < ? " + gradeQualifier; 
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('grades', response);

       let resultData = [];
       if (response.length > 0) {
           let row = response[0];
           resultData.push([row.goodSem1, row.goodSem2] );
           resultData.push([row.badSem1, row.badSem2] );
       }

        res.status(200).json({ grades: resultData });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;