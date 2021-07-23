import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('year ', year);

        let query = 
            "select CONVERT(b.grade_number, UNSIGNED INTEGER) as name, " + 
                "count(b.ch_id) as y " + 
            "from child b " + 
            "inner join ( " + 
                "Select a.child_id from attendance a " + 
                "where YEAR(a.attendance_date) = ? " + 
                "Group by a.child_id " +
            ") as a2 on b.ch_id = a2.child_id " +
            "group by name order by name";
//        const response =  await db.query("SELECT id2,email FROM users where id=UUID_TO_BIN(?)", [id]);
        console.log('Query ', query);
        const response =  await db.query(query, [year]);

        console.log('Mentee', response);
        res.status(200).json({ menteePerYear: response });
    } catch (error) {

    }
});

export default router;