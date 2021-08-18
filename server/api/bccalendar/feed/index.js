import express from "express";

//import { makeDb } from "../../../helpers/database";

const router = express.Router();

const fs  = require('fs')
const ics = require('ics')


const { createWriteStream, writeFileSync } = fs;

router.get("/", async (req, res) => {
//    const { writeFileSync } = require('fs')


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

            res.setHeader('Content-Type', 'text/calendar');
            res.setHeader('Content-Length', value.length);
            res.setHeader('Content-Disposition', 'attachment; filename=calendar_feed.ics');

       
            const currentPath = `${__dirname}/event.ics`;
            console.log('currentPath',currentPath)
            writeFileSync(currentPath, value)


            return res.download(currentPath, 'event.ics', function(err) {
                fs.unlink(currentPath, function(){
                    console.log("Temp File was deleted");
                });        
            });
    

        }
    )
});

export default router;