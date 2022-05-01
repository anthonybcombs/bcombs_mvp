import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, vendorId, isLot } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('year ', year);
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01'; 
        let dtNext = new Date(dtNextText);
        const isLotRequired = isLot ? " and a.child_id=app.child and app.is_lot=1 "  : " " ;
        let query = 
            "select CONVERT(b.grade_number, UNSIGNED INTEGER) as name, " + 
                "count(b.ch_id) as y " + 
            "from child b " + 
            "inner join ( " + 
                "Select a.child_id " + 
                "FROM application app, attendance a, vendor b, vendor_app_groups c " + 
               "where a.attendance_date >= ? and a.attendance_date < ? " +
               "and b.id2 = ? and c.vendor = b.id  " + // and a.app_group_id = c.app_grp_id
               isLotRequired + 
               "Group by a.child_id " +
            ") as a2 on b.ch_id = a2.child_id " +
            "group by name order by name";
//        const response =  await db.query("SELECT id2,email FROM users where id=UUID_TO_BIN(?)", [id]);
        console.log('Querqqqqy ', query);
        console.log('Querqqqqy params ',  [dtLast, dtNext, vendorId]);
//        const response =  await db.query(query, [year]);
        const response =  await db.query(query, [dtLast, dtNext, vendorId]);

        console.log('Mentee', response);
        res.status(200).json({ menteePerYear: response });
    } catch (error) {
        console.log('Error', error)
    }
});

export default router;