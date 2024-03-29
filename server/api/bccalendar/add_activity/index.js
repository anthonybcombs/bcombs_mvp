import express from "express";

import { makeDb } from "../../../helpers/database";
import { generateAndUploadQRCodeToS3 } from "../../../helpers/upload";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        console.log('calendar add activity 1');
        const { vendorId, userId, eventData } = req.body;
        const db = makeDb();

   
        const eventPath = `${process.env.APP_URL}/event/${eventData.id}/attendance`;

        const qrResp = await generateAndUploadQRCodeToS3(eventPath, `${eventData.id}.png`, 'events');


        let queryParam = [eventData.id, vendorId, eventData.event_type, userId, eventData.title,
            new Date(eventData.start), new Date(eventData.end), eventData.isFullDay, eventData.idClass,
            eventData.description, eventData.tags, qrResp.Key];


       let query = 
            "INSERT INTO bc_calendar_event " +
                "(id, vendor_id2, event_type, creator_auth_id, title, " + 
                    "start, end, is_full_day, vendor_app_group, description, tags, qr_code_url) " +
                "VALUES (?, ?, ?, ?, ?, " + 
                    "?, ?, ?, ?, ?, ?, ?);";
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('calendar add activity', response);

        res.status(200).json({ result: response });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;