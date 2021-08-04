import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        console.log('calendar add activity 1');
        const { vendorId, userId, eventData } = req.body;
        const db = makeDb();

       let queryParam = [eventData.id, vendorId, eventData.event_type, userId, eventData.title,
            new Date(eventData.start), new Date(eventData.end), eventData.isFullDay, eventData.idClass];

       let query = 
            "INSERT INTO bc_calendar_event " +
                "(id, vendor_id2, event_type, creator_auth_id, title, " + 
                    "start, end, is_full_day, vendor_app_group) " +
                "VALUES (?, ?, ?, ?, ?, " + 
                    "?, ?, ?, ?);";
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('calendar add activity', response);

        res.status(200).json({ result: response });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;