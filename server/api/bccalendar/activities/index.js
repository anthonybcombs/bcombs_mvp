import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { vendorId, userId } = req.body;
        const db = makeDb();

       let queryParam = [vendorId]; //, userId];

       let result = {
        activities: [],
        app_groups: []
       }

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
     //  console.log('calendar activities', response);
       if (response.length > 0) {
           result.activities = response;
       }

       let query2Param = [vendorId]; //, userId];
       let query2 = 
        "SELECT a.id, a.name, c.event_color FROM vendor b, " + 
            "vendor_app_groups a left join bc_vendor_app_groups_ext c on a.app_grp_id = c.app_grp_id " + 
            "WHERE a.vendor = b.id and b.id2 = ? ORDER BY a.name";
        const response2 =  await db.query(query2, query2Param);
       // console.log('calendar activities', response2);
        if (response2.length > 0) {
            result.app_groups = response2;
        }
 
        res.status(200).json(result);
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;