import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, grade } = req.body;
        const db = makeDb();
       // console.log('a ID', id)
       // const response =  await db.query("SELECT id2,email FROM users where id=UUID_TO_BIN(?)", [id]);
        let dtLastTxt = '' + (year - 1) + '-08-01';
        //let dtLast = new Date(dtLastTxt);

        let dtEndQ1Txt = '' + (year - 1) + '-11-01';
        let dtEndQ2Txt = '' + year + '-02-01';
        let dtEndQ3Txt = '' + year + '-05-01';
        /*
        var dtEndQ1 = new Date(dtLast.getTime());
        var dtEndQ1 = dtEndQ1.setMonth(dtEndQ1.getMonth()+3);
        var dtEndQ2 = new Date(dtLast.getTime());
        var dtEndQ2 = dtEndQ2.setMonth(dtEndQ2.getMonth()+6);
        var dtEndQ3 = new Date(dtLast.getTime());
        var dtEndQ3 = dtEndQ3.setMonth(dtEndQ3.getMonth()+9);
        */

       let dtNextTxt = '' + year + '-08-01'; 
       //let dtNext = new Date(dtNextText);

       let queryParam = [dtEndQ1Txt, 
            dtEndQ1Txt, dtEndQ2Txt, 
            dtEndQ2Txt, dtEndQ3Txt, 
            dtEndQ3Txt, 
            dtLastTxt, dtNextTxt];
       let gradeQualifier = '';
       if (grade > 8) {
           gradeQualifier = "where b.grade_number = ? ";
           queryParam.push(grade);
       }
       else if (grade > 5) {
           gradeQualifier = "where b.grade_number in ( '6', '7', '8' )";
       }

       let query = 
           "select SUM(a2.q1) as q1Total, " +
                "SUM(a2.q2) as q2Total, " +
                "SUM(a2.q3) as q3Total, " +
                "SUM(a2.q4) as q4Total, " +
               "count(b.ch_id) as y " + 
           "from child b " + 
           "inner join ( " + 
               "Select a.child_id " + 
               ", SUM(IF(a.attendance_date < ?, 1, 0)) as q1 " + 
               ", SUM(IF(a.attendance_date >= ? AND a.attendance_date < ?, 1, 0)) as q2 " + 
               ", SUM(IF(a.attendance_date >= ? AND a.attendance_date < ?, 1, 0)) as q3 " + 
               ", SUM(IF(a.attendance_date >= ?, 1, 0)) as q4 " + 
               "FROM attendance a " + 
              "where a.attendance_date >= ? and a.attendance_date < ? " +
               "Group by a.child_id " +
           ") as a2 on b.ch_id = a2.child_id " + gradeQualifier;
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('Attendance', response);

       let resultData = [];
       if (response.length > 0) {
           let row = response[0];
           resultData.push({name: "Q1", y: row.q1Total });
           resultData.push({name: "Q2", y: row.q2Total });
           resultData.push({name: "Q3", y: row.q3Total });
           resultData.push({name: "Q4", y: row.q4Total });
       }

        res.status(200).json({ attendance: resultData });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;