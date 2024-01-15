import express from "express";

import { makeDb } from "../../../helpers/database";
import { 
    getFormsByVendorId, 
    getClassesWithAttendanceByYearAndVendorAndFormId 
} from "../form_and_class_queries";

const router = express.Router();

router.post("/", async (req, res) => {

    const loadDataForYear = async (db, vendorId, grade, testName, year, formId, classId) => {
        let response = null
        try {
            let dtLastTxt = '' + (year - 1) + '-08-01';
            let dtNextTxt = '' + year + '-08-01'; 
     
            let fromClause = "FROM vendor a, vendor_app_groups a2, vendor_app_groups_to_student b, student_standardized_test c ";
            let whereClause = "WHERE a.id2 = ? and a2.vendor = a.id and b.app_grp_id = a2.app_grp_id and c.child_id = b.child_id ";
            let queryParam = [vendorId, testName, dtLastTxt, dtNextTxt];

            if (formId && formId != 'fid_0' && formId !== 'lotid_0') {
                if(classId === 'id_0') {
                    fromClause = "From vendor_custom_application a2, student_standardized_test c ";
                    // whereClause = "where a2.form = UUID_TO_BIN(?) and b.app_grp_id = a2.app_grp_id and c.child_id = b.child_id ";
                    whereClause = "where a2.form_id = UUID_TO_BIN(?) ";
                    queryParam = [formId, testName, dtLastTxt, dtNextTxt];
                }
                else {
                    fromClause = "From vendor_app_groups a2, student_standardized_test c ";
                    // whereClause = "where a2.form = UUID_TO_BIN(?) and b.app_grp_id = a2.app_grp_id and c.child_id = b.child_id ";
                    whereClause = "where a2.form = UUID_TO_BIN(?) ";
                    queryParam = [formId, testName, dtLastTxt, dtNextTxt];
                }
            
            }
            else if(formId === 'lotid_0') {
                fromClause = "From  vendor a, vendor_app_groups a2, vendor_app_groups_to_student b, student_standardized_test c, child ch, application app ";
                whereClause = "where a.id2 = ? AND  a2.vendor = a.id AND b.app_grp_id = a2.app_grp_id and c.child_id = ch.ch_id  AND ch.ch_id=app.child  AND app.class_teacher LIKE concat('%',BIN_TO_UUID(b.app_grp_id,'%'))  AND app.is_lot=1  ";
                queryParam = [ vendorId,testName, dtLastTxt, dtNextTxt];
            }


            if ((classId &&   classId != 'id_0') && formId !== 'lotid_0') {
                fromClause = "From vendor_app_groups_to_student b, student_standardized_test c ";
                whereClause = "where b.app_grp_id = UUID_TO_BIN(?) and c.child_id = b.child_id ";
                queryParam = [classId, testName, dtLastTxt, dtNextTxt];
            }
            // else if((classId && classId != 'id_0') && formId === 'lotid_0' ) {
            //     fromClause = "From vendor a, vendor_app_groups_to_student b, student_standardized_test c ";
            //     whereClause = "where a.id2 = ? AND b.app_grp_id = UUID_TO_BIN(?) AND c.child_id = b.child_id ";
            //     queryParam = [vendorId, classId];
            // }
    
             let gradeTable = '';
             let gradeQualifier = '';
             if (grade > 8) {
                 gradeTable = ", child d ";
                 gradeQualifier = "and d.grade_number = ? and c.child_id = d.ch_id ";
                 queryParam.push(grade);
             }
             else if (grade > 5) {
                 gradeTable = ", child d ";
                 gradeQualifier = "and d.grade_number in ( '6', '7', '8' ) and c.child_id = d.ch_id ";
             }
     
            let query = 
                 "SELECT AVG(score) as avgScore " + 
                 //"FROM vendor a, application b, student_standardized_test c " 
                 fromClause + gradeTable +
                 //"where a.id2 = ? and b.vendor = a.id and c.child_id = b.child " +
                 whereClause +
                     "and c.test_name = ? " +
                     "and c.month_taken >= ? and c.month_taken < ? " + gradeQualifier; 
            console.log('Average Standardized Test Query ', query);
            console.log('Average Standardized QueryParams ', queryParam);



    
            response =  await db.query(query, queryParam);
        }
        catch (error) {
            console.log("error: ", error);
        }
        return (response && response.length > 0) ? response[0].avgScore : 0;
    }


    try {
        const { id, grade, vendorId, testName, formId, classId, lotVendorIds, isLot } = req.body;
        const db = makeDb();

        let formArray = await getFormsByVendorId(db, vendorId, lotVendorIds, isLot);
        if (!formArray.length) {
            res.status(200).json({ avgTestResults: [], classList: [], formArray: [] });
            return;
        }
        console.log('getting class list');

        let classList = await getClassesWithAttendanceByYearAndVendorAndFormId(db, 'any', vendorId, formId, lotVendorIds);
        if (!classList.length) {
            res.status(200).json({ avgTestResults: [], classList: [], formArray: formArray });
            return;
        }
        console.log('got class list', classList);


        let returnData = [];
        for (let year = 2020; year < 2025; year++) {
            let averageScore = await loadDataForYear(db, vendorId, grade, testName, year, formId, classId );
            returnData.push(averageScore ? averageScore : 0);
        }

        console.log('tests', returnData);
        res.status(200).json({ avgTestResults: returnData, classList: classList, formArray: formArray });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {
        console.log(error);
    }
});

export default router;