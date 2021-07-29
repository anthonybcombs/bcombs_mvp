import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, grade, vendorId } = req.body;
        const db = makeDb();
        console.log('vendorID ', vendorId)
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
            dtLastTxt, dtNextTxt,
            vendorId];
            /*
       let gradeQualifier = '';
       if (grade > 8) {
           gradeQualifier = "where b.grade_number = ? ";
           queryParam.push(grade);
       }
       else if (grade > 5) {
           gradeQualifier = "where b.grade_number in ( '6', '7', '8' )";
       }
       */

       let query = 
           "select " + 
                "SUM(IF(b.grade_number = '12', a2.q1, 0)) as q1Total12, " +
                "SUM(IF(b.grade_number = '12', a2.q2, 0)) as q2Total12, " +
                "SUM(IF(b.grade_number = '12', a2.q3, 0)) as q3Total12, " +
                "SUM(IF(b.grade_number = '12', a2.q4, 0)) as q4Total12, " +
                "SUM(IF(b.grade_number = '11', a2.q1, 0)) as q1Total11, " +
                "SUM(IF(b.grade_number = '11', a2.q2, 0)) as q2Total11, " +
                "SUM(IF(b.grade_number = '11', a2.q3, 0)) as q3Total11, " +
                "SUM(IF(b.grade_number = '11', a2.q4, 0)) as q4Total11, " +
                "SUM(IF(b.grade_number = '10', a2.q1, 0)) as q1Total10, " +
                "SUM(IF(b.grade_number = '10', a2.q2, 0)) as q2Total10, " +
                "SUM(IF(b.grade_number = '10', a2.q3, 0)) as q3Total10, " +
                "SUM(IF(b.grade_number = '10', a2.q4, 0)) as q4Total10, " +
                "SUM(IF(b.grade_number = '9', a2.q1, 0)) as q1Total9, " +
                "SUM(IF(b.grade_number = '9', a2.q2, 0)) as q2Total9, " +
                "SUM(IF(b.grade_number = '9', a2.q3, 0)) as q3Total9, " +
                "SUM(IF(b.grade_number = '9', a2.q4, 0)) as q4Total9, " +
                "SUM(IF(b.grade_number = '6' OR b.grade_number = '7' OR b.grade_number = '8', a2.q1, 0)) as q1TotalMS, " +
                "SUM(IF(b.grade_number = '6' OR b.grade_number = '7' OR b.grade_number = '8', a2.q2, 0)) as q2TotalMS, " +
                "SUM(IF(b.grade_number = '6' OR b.grade_number = '7' OR b.grade_number = '8', a2.q3, 0)) as q3TotalMS, " +
                "SUM(IF(b.grade_number = '6' OR b.grade_number = '7' OR b.grade_number = '8', a2.q4, 0)) as q4TotalMS, " +
               "count(b.ch_id) as y " + 
           "from child b " + 
           "inner join ( " + 
               "Select a.child_id " + 
               ", SUM(IF(a.attendance_date < ?, 1, 0)) as q1 " + 
               ", SUM(IF(a.attendance_date >= ? AND a.attendance_date < ?, 1, 0)) as q2 " + 
               ", SUM(IF(a.attendance_date >= ? AND a.attendance_date < ?, 1, 0)) as q3 " + 
               ", SUM(IF(a.attendance_date >= ?, 1, 0)) as q4 " + 
               "FROM attendance a, vendor b, vendor_app_groups c " + 
              "where a.attendance_date >= ? and a.attendance_date < ? " + 
              "and b.id2 = ? and c.vendor = b.id and a.app_group_id = c.app_grp_id " +
               "Group by a.child_id " +
           ") as a2 on b.ch_id = a2.child_id ";
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('Attendance', response);

       let resultData = [];
       if (response.length > 0) {
           let row = response[0];
           resultData.push({grade: "8", data: [row.q1TotalMS, row.q2TotalMS, row.q3TotalMS, row.q4TotalMS] });
           resultData.push({grade: "9", data: [row.q1Total9, row.q2Total9, row.q3Total9, row.q4Total9] });
           resultData.push({grade: "10", data: [row.q1Total10, row.q2Total10, row.q3Total10, row.q4Total10] });
           resultData.push({grade: "11", data: [row.q1Total11, row.q2Total11, row.q3Total11, row.q4Total11] });
           resultData.push({grade: "12", data: [row.q1Total12, row.q2Total12, row.q3Total12, row.q4Total12] });
       }

        res.status(200).json({ attendance: resultData });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;