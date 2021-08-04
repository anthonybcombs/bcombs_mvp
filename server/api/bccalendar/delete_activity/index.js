import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { eventData } = req.body;
        const db = makeDb();

       let queryParam = [eventData.id];

       let query = "DELETE FROM bc_calendar_event WHERE id = ? "; 
       console.log('Query ', query);
       const response =  await db.query(query, queryParam);
       console.log('calendar delete activity', response);

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