import express from "express";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {
//    const { writeFileSync } = require('fs')
    const { createWriteStream } = require('fs')
    const ics = require('ics')

    ics.createEvent({
        title: 'Dinner',
        description: 'Nightly thing I do',
        busyStatus: 'FREE',
        start: [2021, 1, 15, 6, 30],
        duration: { minutes: 50 }
        }, 
        (error, value) => {
            if (error) {
                console.log(error)
            }

            res.writeHead(200, {
                'Content-Type': 'text/calendar',
                'Content-Length': value.length, // stat.size,
                'Content-Disposition': 'attachment; filename=calendar_feed.ics'
            });

            //writeFileSync(`${__dirname}/event.ics`, value)
            var outStream = createWriteStream(value);
            res.pipe(outStream);
        }
    )
});

export default router;