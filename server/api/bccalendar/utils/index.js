import { generateAndUploadQRCodeToS3 } from "../../../helpers/upload";
import { makeDb } from "../../../helpers/database";

const createUpdateEvent = async data => {
    const { vendorId, userId, eventData } = data;
    let qrResp = null;
    const db = makeDb();
    try {
        console.log('calendar add activity 1');



        const eventPath = `${process.env.APP_CLIENT_URL}/event/${eventData.id}/attendance`;
        qrResp = await generateAndUploadQRCodeToS3(eventPath, `${eventData.id}`, 'events');


        let queryParam = [
            eventData.id, 
            vendorId,
            eventData.event_type, 
            userId, 
            eventData.title,
            new Date(eventData.start), 
            new Date(eventData.end), 
            eventData.isFullDay, 
            eventData.idClass,
            eventData.description, 
            eventData.tags, 
            qrResp.Key, 
            eventData.attendance_type,
            eventData.attendance_app_group
        
        ];


        let query = "INSERT INTO bc_calendar_event " +
            "(id, vendor_id2, event_type, creator_auth_id, title, " +
            "start, end, is_full_day, vendor_app_group, description, tags, qr_code_url, attendance_type, attendance_app_group) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        await db.query(query, queryParam);

    
    } catch (error) {
        console.log('Create Update Event Error', error)
        return {
            message: ' Something went wrong'
        }
    }
    finally {
        db.close();
        return {
            event_id: eventData.id,
            qr_code_url: qrResp.Key

        }
    }
};

export {
    createUpdateEvent
}