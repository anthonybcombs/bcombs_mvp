import moment from 'moment';
import { uuid } from "uuidv4";

class BC_CalendarActivity {
     constructor(activityToCopy) {
        if (activityToCopy===undefined) {
            this.id = null;
            this.event_type = 'event';
            this.isNew = false;
            this.title = ''; 
            this.start = null; 
            this.end = null; 
            this.isFullDay = false; 
            this.idClass = null;
            return;
        }
        this.loadFromActivity(activityToCopy);
        if (!this.id) {
            this.id = uuid();
        }
    }

    setTitle = (title) => { 
        this.title = title; 
    }
    setStart = (startDate) => { 
        this.start = startDate; 
    }
    setEnd = (endDate) => { 
        this.end = endDate; 
    }
    getStartForDisplay = (format) => { 
        if (!this.start) {
            return "<No Date Set>";
        }
        return moment(this.start).format(format); 
    }
  
    loadFromActivity = (activity) => {
        this.id = activity.id;
        this.event_type = activity.event_type;
        this.isNew = activity.isNew;
        this.title = activity.title; 
        this.start = activity.start; 
        this.end = activity.end; 
        this.isFullDay = activity.isFullDay; 
        this.idClass = activity.idClass;
    }
    
    loadFromDBRow = (row, classList) => {
        this.isNew = false;
        this.id = row.id;
        this.event_type = row.event_type;
        this.isFullDay = row.is_full_day;
        this.title = row.title;
        this.start = new Date(row.start);
        this.end = new Date(row.end);
        this.idClass = row.idClass;
        if (classList && classList[row.idClass] && classList[row.idClass].event_color) {
            this.color = classList[row.idClass].event_color;
        }
        else if (row.idClass) {
            this.color = 'green';
        }
    }

    //use activity as returned from full calendar
    setToExistingActivity = (fc_activity) => {
        this.isNew = false;
        this.id = fc_activity.id;
        this.isFullDay = fc_activity.extendedProps.isFullday;
        this.title = fc_activity.title;
        this.start = fc_activity.start;
        this.end = fc_activity.end;
    }
  
    setWithNewClickInfo = (info) => {
        let dateStart = info.date;
        if (info.allDay) {
          dateStart = new Date(dateStart.getFullYear(), 
                dateStart.getMonth(), dateStart.getDate(), 11, 30);
        }
        let dateEnd = moment(dateStart).add(1, 'hour').toDate();
        this.isNew = true;
        this.isFullDay = info.allDay;
        this.title = '';
        this.start = dateStart;
        this.end = dateEnd;
    }

    // *********** DB STUFF **************************** /
    static async GetCalendarActivitiesFromDB(vendorId, userId) {
    
        const response = await fetch(`${process.env.API_HOST}/api/bccalendar/activities`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                'userId' : userId,
                'vendorId' : vendorId
            }) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
      
      

    addCalendarActivityToDB = async (vendorId, auth) => {
        try {
            if (!vendorId) {
                return;
            }
            const res = await this.addCalendarActivityToDBlocal(vendorId, auth.user_id);
            console.log('apiCall add calendar activity ', res)
            if (res && res.result && res.result.affectedRows != 1) {
              console.log('SQL message: ', res.result.message);
            }
        } catch (err) {
            console.log('Error', err)
        }
    }
    
    addCalendarActivityToDBlocal = async (vendorId, userId) => {
        console.log('addCalendarActivityToDBLocal');
        const response = await fetch(`${process.env.API_HOST}/api/bccalendar/add_activity`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                'userId' : userId,
                'vendorId' : vendorId,
                'eventData': this
            }) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    updateCalendarActivityInDB = async (vendorId, auth) => {
        try {
            if (!vendorId) {
                return;
            }
            const res = await this.updateCalendarActivityInDBlocal(vendorId, auth.user_id);
            console.log('apiCall update calendar activity ', res)
            if (res && res.result && res.result.affectedRows != 1) {
              console.log('SQL message: ', res.result.message);
            }
        } catch (err) {
            console.log('Error', err)
        }
    }
    
    updateCalendarActivityInDBlocal = async (vendorId, userId) => {
        console.log('updateCalendarActivityInDBlocal');
        const response = await fetch(`${process.env.API_HOST}/api/bccalendar/update_activity`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                'userId' : userId,
                'vendorId' : vendorId,
                'eventData': this
            }) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    deleteCalendarActivityFromDB = async () => {
        try {
            const res = await this.deleteCalendarActivityFromDBlocal();
            console.log('apiCall delete calendar activity ', res)
            if (res && res.result && res.result.affectedRows != 1) {
              console.log('SQL message: ', res.result.message);
            }
        } catch (err) {
            console.log('Error', err)
        }
    }

    deleteCalendarActivityFromDBlocal = async () => {
        const response = await fetch(`${process.env.API_HOST}/api/bccalendar/delete_activity`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: { 'Content-Type': 'application/json' },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({
                'eventData': this
            }) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
      
}

export default BC_CalendarActivity;
