import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();


router.post("/", async (req, res) => {

    try {
        console.log('feed parameter add activity 1');
        const { uuid, vendorId, userId, calendarActivities } = req.body;
        const db = makeDb();

        const param = {
            user: userId,
            calendarActivities: calendarActivities,
            vendor: vendorId,
        }
       let queryParam = [uuid, JSON.stringify(param)];

       let query = 
            "INSERT INTO bc_calendar_feed_param " +
                "(feed_key, param) " +
                "VALUES (?, ?);";
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('calendar feed param add ', response);

        res.status(200).json({ result: response });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;