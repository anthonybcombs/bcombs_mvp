import express from "express";

import { makeDb } from "../../../helpers/database";
import { 
    getFormsByVendorId, 
    getClassesWithAttendanceByYearAndVendorAndFormId 
} from "../form_and_class_queries";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, grade, vendorId, formId, classId , lotVendorIds, isLot } = req.body;
        const db = makeDb();

        console.log('vendorIdddd22 ', vendorId);

        let formArray = await getFormsByVendorId(db, vendorId, lotVendorIds, isLot);
      
        if (!formArray.length) {
            res.status(200).json({ grades: [], classList: [], formArray: [] });
            return;
        }
        console.log('getting class list');

        let classList = await getClassesWithAttendanceByYearAndVendorAndFormId(db, year, vendorId, formId, lotVendorIds);
        if (!classList.length) {
            res.status(200).json({ grades: [], classList: [], formArray: formArray });
            return;
        }
        console.log('got class list');


        let dtLastTxt = '' + (year - 1) + '-08-01';
       let dtNextTxt = '' + year + '-08-01'; 

        let fromClause = "FROM vendor a, vendor_app_groups b, student_grade_cumulative c ";
        let whereClause = "WHERE a.id2 = ? and b.vendor = a.id and c.app_group_id = b.app_grp_id ";
        let queryParam = [vendorId, dtLastTxt, dtNextTxt];

        if (formId && formId === 'lotid_0') {
            fromClause = "FROM vendor a, vendor_app_groups b, student_grade_cumulative c, child ch, application app ";
            whereClause = "WHERE a.id2 = ? and b.vendor = a.id and c.app_group_id = b.app_grp_id AND app.child=c.child_id  AND app.class_teacher LIKE concat('%',BIN_TO_UUID(b.app_grp_id,'%')) AND app.is_lot=1  ";
            queryParam = [vendorId, dtLastTxt, dtNextTxt];
        }

        else if (formId && formId != 'fid_0' && formId !== 'lotid_0') {
            fromClause = "From vendor_app_groups b, student_grade_cumulative c ";
            whereClause = "where b.form = UUID_TO_BIN(?) and c.app_group_id = b.app_grp_id";
            queryParam = [formId, dtLastTxt, dtNextTxt];
        }


        
        if (classId && classId != 'id_0') {
            fromClause = "From student_grade_cumulative c ";
            whereClause = "where c.app_group_id = UUID_TO_BIN(?)";
            queryParam = [classId, dtLastTxt, dtNextTxt];
        }

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
            "SELECT SUM(IF(c.gpa_sem_1 <= 2.5, 1, 0)) as badSem1, SUM(IF(c.gpa_sem_1 > 2.5, 1, 0)) as goodSem1, " + 
                "SUM(IF(c.gpa_sem_2 <= 2.5, 1, 0)) as badSem2, SUM(IF(c.gpa_sem_2 > 2.5, 1, 0)) as goodSem2 " + 
            //"FROM vendor a, vendor_app_groups b, student_grade_cumulative c " +
            fromClause + gradeTable +
            //"where a.id2 = ? and b.vendor = a.id and c.app_group_id = b.app_grp_id " +
            whereClause +
                " and c.school_year_start >= ? and c.school_year_start < ? " + gradeQualifier; 
       console.log('GRADESS QUERYYYYYYYYYYYYYYYYYYYY ', query);
       console.log('GRADESS QUERYYYYYYYYYYYYYYYYYYYY Param ', queryParam);
       const response =  await db.query(query, queryParam);
       console.log('gradesssss', response);

       let resultData = [];
       if (response.length > 0) {
           let row = response[0];
           resultData.push([row.goodSem1, row.goodSem2] );
           resultData.push([row.badSem1, row.badSem2] );
       }
       console.log('resultDataaaaaaaaaaaaa', resultData)
        res.status(200).json({ grades: resultData, classList: classList, formArray: formArray });
        //res.status(200).json({ user: response && response[0] });
    } catch (error) {
        console.log(error);
    }
});

export default router;