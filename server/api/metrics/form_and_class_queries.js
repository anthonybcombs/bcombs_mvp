
export async function getFormsByVendorId(db, vendorId) {
    let queryFormFormIds =
        "select BIN_TO_UUID(vca.form_id) as formId, vca.form_name from vendor_custom_application as vca, vendor v " +
        "where vca.vendor=v.id AND v.id2=? and vca.status <> 'deleted' " + 
        "order by vca.form_name;";
    let queryFormFormIdsParam = [vendorId];
    const response0 =  await db.query(queryFormFormIds, queryFormFormIdsParam);
    console.log('%%%% form resp: ', response0);
    if (!response0 || response0.length == 0) {
        return [];
    }

    let formArray = [{key: 'fid_0', name: 'BCombs Form'}];
    for (let r0 = 0; r0 < response0.length; r0++) {
        formArray.push({key: response0[r0].formId, name: response0[r0].form_name });
    }
    console.log('ret forms: ', formArray);
    return formArray;
}

export async function getClassesWithAttendanceByYearAndVendorAndFormId(db, year, vendorId, formId) {
    console.log('in getClassesWithAttendanceByYearAndVendorAndFormId');
    let queryClause = getSQLClauseForAttendanceAndClassData(year, vendorId, formId);
    let query = 'Select c2.name as class_name, BIN_TO_UUID(c2.app_grp_id) as class_id ' +
        queryClause.query + 
        ' Group By c2.app_grp_id, c2.name Order By c2.name';

    const response0 =  await db.query(query, queryClause.param);
    console.log('%%%% classes resp: ', response0);
    if (!response0 || response0.length == 0) {
        return [];
    }

    let classList = [{key: 'id_0', name: 'All Classes'}];
    for (let i =0; i< response0.length; i++) {
        let row = response0[i];
        classList.push({key: row.class_id, name: row.class_name});
    }
    return classList;
}

export function getSQLClauseForAttendanceAndClassData(year, vendorId, formId) {
    let getClassesTableQuery =
    "From attendance a2, vendor b2, vendor_app_groups c2 " +
    "where a2.attendance_date >= ? and a2.attendance_date < ? and " + 
        "b2.id2 = ? and c2.vendor = b2.id and " + 
        "a2.app_group_id = c2.app_grp_id ";

    let dtLastTxt = '' + (year - 1) + '-08-01';
    let dtNextTxt = '' + year + '-08-01'; 
    let queryParamForClassesQuery = [dtLastTxt, dtNextTxt, vendorId];

    if (formId && formId != 'fid_0') {
        getClassesTableQuery =
            "From attendance a2, vendor_app_groups c2 " +
            "where a2.attendance_date >= ? and a2.attendance_date < ? and " + 
                "c2.form = UUID_TO_BIN(?) and " +
                "a2.app_group_id = c2.app_grp_id ";
        queryParamForClassesQuery = [dtLastTxt, dtNextTxt, formId];
    }

    return {
        query: getClassesTableQuery,
        param: queryParamForClassesQuery
    }

}

export function addToSeries(series, key) {
    let seriesKeyData = series[key];
    if (!seriesKeyData) {
        seriesKeyData = { name: key, y: 0};
    }
    seriesKeyData.y++;
    series[key] = seriesKeyData;
    return series;
}

