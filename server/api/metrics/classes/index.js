import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, vendorId } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('vendor ', vendorId );
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01'; 
        let dtNext = new Date(dtNextText);

        let queryParam = [vendorId];

        let query = "SELECT count(a.child_id) as numStudents, b.name " + 
            "FROM vendor_app_groups_to_student a, vendor_app_groups b, vendor c " +
            "where a.app_grp_id = b.app_grp_id " + 
            "and c.id2 = ? and b.vendor = c.id " +
            "group by b.app_grp_id";
        console.log('Query ', query);
        const response =  await db.query(query, queryParam);
        console.log('student counts ', response);

        let returnData = [];
        for (let i=0; i<response.length; i++) {
            let row = response[i];
            returnData.push({ name: row.name, y: row.numStudents });
        }

        res.status(200).json({ classData: returnData });
    } catch (error) {

    }
});

export default router;