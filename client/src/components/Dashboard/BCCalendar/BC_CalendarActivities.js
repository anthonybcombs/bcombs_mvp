import BC_CalendarActivity from "./activity/BC_CalendarActivity";

class BC_CalendarActivities {
    constructor() {
        this.unfilteredEvents = [];
        this.classList = [];
        this.filters = [];
        this.searchTerm = '';
    }

    static async GetFromDB(vendorId, userId) {
    
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

    static async LoadActivities(vendorId, auth, handleCalendarActiviesReturned) {
        let activiesToReturn = new BC_CalendarActivities();
        try {
            console.log('apiCall get calendar activities: vendor ', vendorId)
            if (!vendorId) {
                handleCalendarActiviesReturned(activiesToReturn);
              return;
            }
            const res = await BC_CalendarActivities.GetFromDB(vendorId, auth.user_id);
            console.log('apiCall get calendar activities ', res)
            let classList = []
            if (res && res.app_groups && res.app_groups.length > 0) {
              for (let i = 0; i < res.app_groups.length; i++) {
                const classData = res.app_groups[i];
                classList[classData.id] = classData;
              }
              activiesToReturn.setClassList(classList);
            }
            if (res && res.activities && res.activities.length > 0) {
              let activityList = []
              for (let i = 0; i < res.activities.length; i++) {
                const row = res.activities[i];
                let activityFromDB = new BC_CalendarActivity();
                activityFromDB.loadFromDBRow(row, classList);
                activityList.push(activityFromDB);
              }
              activiesToReturn.setUnfilteredEvents(activityList);
              //console.log("--------activityList: ", activityList);
            }
            if (res && res.filter_groups && res.filter_groups.length > 0) {
                activiesToReturn.setFilters(res.filter_groups);
            }
        } catch (err) {
            console.log('Error', err)
        }
        handleCalendarActiviesReturned(activiesToReturn);
    }

    setUnfilteredEvents(unfilteredEventsIn) {
        this.unfilteredEvents = unfilteredEventsIn;
    }
    setClassList(classListIn) {
        this.classList = classListIn;
    }
    setFilters(filtersIn) {
        this.filters = filtersIn;
    }
    setSearchTerm(searchTermIn) {
        this.searchTerm = searchTermIn;
    }
    adjustFilters(value, key) {
        let adjustedFilters = [];
        for (let i=0; i< this.filters.length; i++) {
          let filter = this.filters[i];
          if (filter.key == key ) {
            filter.isChecked = value;
          }
          adjustedFilters.push(filter);
        }
        this.setFilters(adjustedFilters);
    }

    getFilteredActivityList() {
        let activityList = [];
        for (let i=0; i< this.unfilteredEvents.length; i++) {
          let event = this.unfilteredEvents[i];
          if (this.searchTerm && this.searchTerm.length > 2) {
            if (event.title.toUpperCase().indexOf(this.searchTerm.toUpperCase())< 0) {
                continue;
            }
        }
        if (!event.group_key) { //only events added this session don't have key - they shouldn't be filtered
            activityList.push(event);
            continue;
        }
        let bSkipEvent = false;
        for (let j=0; j<this.filters.length; j++) {
            if (this.filters[j].key == event.group_key) {
                if (!this.filters[j].isChecked) {
                bSkipEvent = true;
                }
                break;
            }
        }
          if (!bSkipEvent) {
            activityList.push(event);
          }
        }
        return activityList;
    }
}

export default BC_CalendarActivities;

