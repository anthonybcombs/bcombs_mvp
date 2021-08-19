import express from "express";
import { getFilteredCalendarActivities } from "../activities/activity_functions"
import moment from 'moment';
import { v4 as uuidv4 } from "uuid";

import { makeDb } from "../../../helpers/database";

const router = express.Router();

const fs  = require('fs')
const ics = require('ics')


const { writeFileSync } = fs;

router.get("/", async (req, res) => {
    const db = makeDb();
    const { key } = req.query;
    //    const { writeFileSync } = require('fs')

    let query1aParam = [key]; 
    let query1a = 
        "SELECT * " + 
        "FROM bc_calendar_feed_param " +
        "where feed_key = ?";
    const response1a =  await db.query(query1a, query1aParam);
    if (response1a.length == 0) {
        res.status(500).json({error:true, Message: "Bad Feed Key"});
        return;
    }

    let feedParam = JSON.parse(response1a[0].param);
    let events = [];
    getFilteredCalendarActivities(feedParam, (error, activities) => {
    if (error) {
            res.status(500).json({error:true, Message: error});
            return;
        }
        for (let i=0; i< activities.length; i++) {
            let dbActivity = activities[i];
            let startMoment = moment(dbActivity.start);
            let endMoment = moment(dbActivity.end);
            let diff = endMoment.diff(startMoment);

            let startAr =   moment(dbActivity.start).format('YYYY-M-D-H-m').split("-");
            for (let i=0; i< startAr.length; i++) {
                startAr[i] = parseInt(startAr[i]);
            }

            let icsEvent = {
                title: dbActivity.title,
                description: dbActivity.description,
                //busyStatus: 'FREE',
                start: startAr,
                duration: { minutes: parseInt(moment.utc(diff).format("mm")) }
            }
            events.push(icsEvent);
        }

        ics.createEvents(events, 
            (error, value) => {
                if (error) {
                    console.log(error)
                }
    
                res.setHeader('Content-Type', 'text/calendar');
                res.setHeader('Content-Length', value.length);
                res.setHeader('Content-Disposition', 'attachment; filename=event.ics');
    
                let uid = uuidv4();
                const currentPath = `${__dirname}/cal-${uid}.ics`;
                console.log('currentPath',currentPath)
                writeFileSync(currentPath, value)
    
    
                return res.download(currentPath, 'cal-'+uid+'.ics', function(err) {
                    fs.unlink(currentPath, function(){
                        console.log("Temp File was deleted");
                    });        
                });
            }
        )


    })

    let query2aParam = [new Date(), key]; 
    let query2a = 
        "UPDATE bc_calendar_feed_param " + 
        "SET last_read = ? " +
        "where feed_key = ?";
    const response2a =  await db.query(query2a, query2aParam);


});

export default router;