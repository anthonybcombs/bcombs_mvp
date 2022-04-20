
export async function getFormsByVendorId(db, vendorId, lotVendorIds = []) {
    let queryFormFormIds =
        "select BIN_TO_UUID(vca.form_id) as formId, vca.form_name, CONVERT(vca.form_contents USING utf8) as form_contents from vendor_custom_application as vca, vendor v " +
        "where vca.vendor=v.id AND v.id2=? and vca.status = 'active' " +
        "order by vca.form_name;";
    let queryFormFormIdsParam = [vendorId];
    const response0 = await db.query(queryFormFormIds, queryFormFormIdsParam);

    console.log('lotVendorIds', lotVendorIds)
    for (let application of response0) {
        application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
        application.form_contents = JSON.parse(application.form_contents);
        let appGroups = await db.query(
            `
            SELECT
              va.id as id,
              BIN_TO_UUID(va.app_grp_id) as app_grp_id,
              BIN_TO_UUID(va.form) as form,
              BIN_TO_UUID(va.vendor) as vendor,
              va.name
            FROM vendor_app_groups  as va, vendor as v
            WHERE va.form=UUID_TO_BIN(?) OR (va.vendor=v.id AND v.id2 IN (?)) 
          `,
            [application.form_id, vendorId, lotVendorIds.join(',')]
        )
        application.app_groups = appGroups;
    }



    if (!response0 || response0.length == 0) {
        return [];
    }

    let formArray = [{ key: 'fid_0', name: 'Mentoring Application' },
    { key: 'lotid_0', name: 'Lot Application' }];
    for (let r0 = 0; r0 < response0.length; r0++) {
        if (response0[r0].form_contents) {
            formArray.push({ key: response0[r0].formId, name: response0[r0].form_contents.formTitle, is_custom_form: true });
        }
        else {
            formArray.push({ key: response0[r0].formId, name: response0[r0].form_name });
        }

    }

    return formArray;
}

export async function getClassesWithAttendanceByYearAndVendorAndFormId(db, year, vendorId, formId, lotVendorIds = []) {
    let classList = [{ key: 'id_0', name: 'All Groups' }];
    try {

        let queryClause = getSQLClauseForAttendanceAndClassData(year, vendorId, formId, lotVendorIds);
        let query = 'Select c2.name as class_name, BIN_TO_UUID(c2.app_grp_id) as class_id ' +
            queryClause.query +
            ' Group By c2.app_grp_id, c2.name Order By c2.name';

        const response0 = await db.query(query, queryClause.param);
        console.log('%%%% classes resp: ', response0);
        if (!response0 || response0.length == 0) {
            return [];
        }

        for (let i = 0; i < response0.length; i++) {
            let row = response0[i];
            classList.push({ key: row.class_id, name: row.class_name });
        }

    } catch (err) {
        console.log('getClassesWithAttendanceByYearAndVendorAndFormId err', err)
    } finally {
        console.log('classListtt',classList)
        return classList;
    }
}

export function getSQLClauseForAttendanceAndClassData(year, vendorId, formId, lotVendorIds = []) {
    let yearClause = '';
    let queryParamForClassesQuery = [];
    if (year && !isNaN(year)) { //allows 'tests' to span any year
        yearClause = "a2.attendance_date >= ? and a2.attendance_date < ? and ";
        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtNextTxt = '' + year + '-08-01';
        queryParamForClassesQuery = [dtLastTxt, dtNextTxt];
    }

    let getClassesTableQuery =
        "From attendance a2, vendor b2, vendor_app_groups c2 " +
        "where " + yearClause +
        "b2.id2 = ? and c2.vendor = b2.id and " +
        "a2.app_group_id = c2.app_grp_id ";

    let queryParamForClassesQuery2 = [...queryParamForClassesQuery];
    queryParamForClassesQuery2.push(vendorId);

    if (formId === 'lotid_0') {
        // getClassesTableQuery =
        // "From attendance a2, vendor b2, vendor_app_groups c2, child ch, application app " +
        // "where " + yearClause +
        // "a2.child_id = ch.ch_id and " +
        // "ch.ch_id = app.child and " +
        // " app.is_lot = 1 and " +
        // "c2.app_grp_id = b.app_grp_id and "
        // "b2.id2 = ? and c2.vendor = b2.id and " +
        // "a2.app_group_id = c2.app_grp_id ";
      
        getClassesTableQuery = "From attendance a2, vendor b2, vendor_app_groups c2 , child ch, application app " +
            "where " + yearClause +
            "(b2.id2 IN (" + lotVendorIds.join(',') + ") OR b2.id2 = ?)  and c2.vendor = b2.id and " +
             ///  "a2.app_group_id = c2.app_grp_id  and " +
            "a2.child_id = ch.ch_id and " +
            "ch.ch_id = app.child and " +
            "app.is_lot = 1 "
      


    }


    if (formId && formId != 'fid_0' && formId != 'lotid_0') {
        getClassesTableQuery =
            "From attendance a2, vendor_app_groups c2 " +
            "where " + yearClause +
            "c2.form = UUID_TO_BIN(?) and " +
            "a2.app_group_id = c2.app_grp_id ";
        queryParamForClassesQuery2 = [...queryParamForClassesQuery];
        queryParamForClassesQuery2.push(formId);
    }

    return {
        query: getClassesTableQuery,
        param: queryParamForClassesQuery2
    }

}

export function addToSeries(series, key) {
    let seriesKeyData = series[key];
    if (!seriesKeyData) {
        seriesKeyData = { name: key, y: 0 };
    }
    seriesKeyData.y++;
    series[key] = seriesKeyData;
    return series;
}

