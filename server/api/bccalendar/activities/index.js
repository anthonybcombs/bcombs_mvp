import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { vendorId, userId } = req.body;
        const db = makeDb();

       let queryParam = [vendorId]; //, userId];

       let query = 
            "SELECT a.* " + 
            "FROM bc_calendar_event a " +
            "where a.vendor_id2 = ? and a.vendor_app_group is NULL ";

        //    let query = 
        //    "SELECT c.* " + 
        //    "FROM vendor a, vendor_app_groups b, bc_calendar_events c " +
        //    "where a.id2 = ? and b.vendor = a.id and c.vendor_app_group = b.app_grp_id ";
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('calendar activities', response);

       let resultData = [];
       if (response.length > 0) {
           resultData = response;
       }

        res.status(200).json({ activities: resultData });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;