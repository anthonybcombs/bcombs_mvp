import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { vendorId, userId, eventData } = req.body;
        const db = makeDb();

        let queryParam = [vendorId, eventData.event_type, userId, eventData.title, eventData.tags, eventData.description,
            new Date(eventData.start), new Date(eventData.end), eventData.isFullDay, eventData.idClass, 
            eventData.id ];

           // let queryTemp = 
           // "UPDATE bc_calendar_event " +
           //  "SET vendor_id2 = '"+vendorId+"', event_type = '"+eventData.event_type+"', creator_auth_id = '"+userId+"', title = '"+eventData.title+"', " + 
           //      "start = '"+eventData.start+"', end = '"+eventData.end+"', is_full_day = "+(eventData.isFullDay ? 'true' : 'false')+", vendor_app_group = "+eventData.idClass+" " +
           // "WHERE id = '"+eventData.id+"'"; 
     

       let query = 
       "UPDATE bc_calendar_event " +
        "SET vendor_id2 = ?, event_type = ?, creator_auth_id = ?, title = ?, tags = ?, description = ?, " + 
            "start = ?, end = ?, is_full_day = ?, vendor_app_group = ? " +
       "WHERE id = ?"; 
        console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('calendar update activity', response);

       let resultData = [];
       if (response.length > 0) {
           let row = response[0];
       }

        res.status(200).json({ result: resultData });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;