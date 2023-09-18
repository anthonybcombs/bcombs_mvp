
import { makeDb } from "../../../helpers/database";

function getGroupIdFromActivity(activity) {
    if (activity.event_type == 'event') {
        return 'E_' + activity.vendor_id2;
    }
    if (activity.event_type == 'class') {
        return 'C_' + activity.vendor_app_group;
    }
    return 'global(' + activity.event_type + ')';
}

function getFilterGroup(activity, app_groups) {
    const retObj = {
        key: getGroupIdFromActivity(activity),
        name: null,
        event_type: activity.event_type,
        group_id: 0,
        color: null,
        isChecked: true
    }
    if (activity.event_type == 'event') {
        retObj.name = 'Events';
        retObj.group_id = activity.vendor_id2;
        retObj.color = 'blue';
        return retObj;
    }
    if (activity.event_type == 'class') {
        const groupDetails = getAppGroupDetails(activity.vendor_app_group, app_groups);
        if (!groupDetails)
            return null;
        retObj.name = groupDetails.name;
        retObj.group_id = activity.vendor_app_group;
        retObj.color = groupDetails.color;
        return retObj;
    }
    return null;
}

function getAppGroupDetails(idGroup, app_groups) {
    for (let i = 0; i < app_groups.length; i++) {
        if (app_groups[i].id == idGroup) {
            return app_groups[i];
        }
    }
    return null;
}

function getAppGroupsWithColors(app_groups) {
    let appGroupsWithColors = [];
    for (let i = 0; i < app_groups.length; i++) {
        let group = app_groups[i];
        if (!group.color) {
            group.color = defaultColors[i % defaultColors.length];
        }
        appGroupsWithColors.push(group);
    }
    return appGroupsWithColors;
}

let defaultColors = ['aqua', 'brown', 'coral', 'cyan', 'green', 'orange', 'yellow', 'pink', 'gold'];

export async function getAllCalendarActivities(vendorId, userId, fnNext) {
    try {
        const db = makeDb();

        let queryParam = [vendorId]; //, userId];

        let result = {
            activities: [],
            app_groups: [],
            filter_groups: []
        }

        let query =
            "SELECT a.* " +
            "FROM bc_calendar_event a " +
            "where a.vendor_id2 = ? and a.vendor_app_group is NULL ";

        console.log('Query ', query);
        const response = await db.query(query, queryParam);
        //  console.log('calendar activities', response);
        if (response.length > 0) {
            result.activities = response;
        }

        let query1bParam = [vendorId]; //, userId];
        let query1b =
            "SELECT c.* " +
            "FROM vendor a, vendor_app_groups b, bc_calendar_event c " +
            "where a.id2 = ? and b.vendor = a.id and c.vendor_app_group = b.id ";
        const response1b = await db.query(query1b, query1bParam);
        //console.log('calendar activities 1b', response1b);
        if (response1b.length > 0) {
            for (let i = 0; i < response1b.length; i++) {
                result.activities.push(response1b[i]);
            }
        }

        let query2Param = [vendorId]; //, userId];
        let query2 =
            "SELECT a.id, a.name, c.event_color FROM vendor b, " +
            "vendor_app_groups a left join bc_vendor_app_groups_ext c on a.app_grp_id = c.app_grp_id " +
            "WHERE a.vendor = b.id and b.id2 = ? ORDER BY a.name";
        const response2 = await db.query(query2, query2Param);
        // console.log('calendar activities', response2);
        if (response2.length > 0) {
            result.app_groups = getAppGroupsWithColors(response2);
        }

        let filterAddedTester = [];
        for (let i = 0; i < result.activities.length; i++) {
            let activity = result.activities[i];
            activity.group_key = getGroupIdFromActivity(activity); //sets group_key on each activity
            if (filterAddedTester[activity.group_key]) {
                continue;
            }
            const filterGroup = getFilterGroup(activity, result.app_groups);
            if (filterGroup) {
                result.filter_groups.push(filterGroup);
            }
            filterAddedTester[activity.group_key] = true; //keep from putting in twice
        }

        fnNext(null, result);
        return;
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {
        fnNext(error);
    }


}

export async function getFilteredCalendarActivities(feedParam, fnNext) {
    getAllCalendarActivities(feedParam.vendor, feedParam.user, (error, retData) => {
        if (error) {
            fnNext(error);
            return;
        }
        let unfilteredEvents = retData.activities;
        let activities = getFilteredActivityList(unfilteredEvents, feedParam.calendarActivities);

        fnNext(null, activities);
    });

}

//same filtering that also can be done on client
function getFilteredActivityList(unfilteredEvents, feedParam) {

    let checkedTags = getCheckedTags(feedParam.tagList);
    let activityList = [];
    for (let i = 0; i < unfilteredEvents.length; i++) {
        let event = unfilteredEvents[i];
        if (checkedTags.length > 0) {
            if (!doesActivityHaveTag(event, checkedTags)) {
                continue;
            }
        }

        if (feedParam.searchTerm && feedParam.searchTerm.length > 2) {
            if (event.title.toUpperCase().indexOf(feedParam.searchTerm.toUpperCase()) < 0) {
                continue;
            }
        }
        if (!event.group_key) { //only events added this session don't have key - they shouldn't be filtered
            activityList.push(event);
            continue;
        }
        let bSkipEvent = false;
        for (let j = 0; j < feedParam.filters.length; j++) {
            if (feedParam.filters[j].key == event.group_key) {
                if (!feedParam.filters[j].isChecked) {
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

function doesActivityHaveTag(activity, checkedTags) {
    if (!activity.tags)
        return false;
    let activityTagArray = activity.tags.split(",");
    for (let i = 0; i < activityTagArray.length; i++) {
        let elemTags = activityTagArray[i].trim();
        for (let j = 0; j < checkedTags.length; j++) {
            if (checkedTags[j].name == elemTags)
                return true;
        }
    }
    return false;
}

function getCheckedTags(tagList) {
    let checkedTags = [];
    for (let i = 0; i < tagList.length; i++) {
        if (!tagList[i].isChecked)
            continue;
        checkedTags.push(tagList[i]);
    }
    return checkedTags;
}


export async function getEventById(id, fnNext) {
    try {
        const db = makeDb();
        let query =
            "SELECT a.* " +
            "FROM bc_calendar_event a " +
            "where a.id = ? ";

        let queryParam = [id];
        const response = await db.query(query, queryParam);
        fnNext(null, response);
        return;
    } catch (error) {
        fnNext(error);
    }


}
