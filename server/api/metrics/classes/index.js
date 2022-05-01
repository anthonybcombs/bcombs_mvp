import express from "express";

import { makeDb } from "../../../helpers/database";
import {
    getFormsByVendorId,
} from "../form_and_class_queries";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id, year, vendorId, formId, lotVendorIds,isLot } = req.body;
        const db = makeDb();
        console.log('m ID', id);
        console.log('vendorrrrrrrrrrrrrrr ', vendorId);

        let formArray = await getFormsByVendorId(db, vendorId, lotVendorIds, isLot);
        if (!formArray.length) {
            res.status(200).json({ classData: [], formArray: [] });
            return;
        }
        console.log('getting class list');


        let dtLastTxt = '' + (year - 1) + '-08-01';
        let dtLast = new Date(dtLastTxt);
        let dtNextText = '' + year + '-08-01';
        let dtNext = new Date(dtNextText);

        let queryParam = [vendorId];
        let query = "SELECT count(a.child_id) as numStudents, b.name " +
            "FROM vendor_app_groups_to_student a, vendor_app_groups b, vendor c " +
            "where a.app_grp_id = b.app_grp_id " +
            "and c.id2 = ? and b.vendor = c.id " +
            "group by b.app_grp_id";


        if (formId && formId === 'lotid_0') {
            query = `SELECT count(app.child) as numStudents, b.name  
            FROM vendor_app_groups_to_student a, vendor_app_groups b, vendor c, child ch, application app
            WHERE a.app_grp_id = b.app_grp_id 
            AND c.id2 = ? AND b.vendor = c.id
            AND ch.ch_id=a.child_id
            AND app.child=a.child_id
            AND app.child=ch.ch_id
            AND app.is_lot=1
            AND app.class_teacher LIKE concat('%',BIN_TO_UUID(b.app_grp_id,'%'))
            GROUP BY b.app_grp_id`
            queryParam = [vendorId];
        }
        else if (formId && formId != 'fid_0' && formId != 'lotid_0') {
            query = "SELECT count(a.child_id) as numStudents, b.name " +
                "FROM vendor_app_groups_to_student a, vendor_app_groups b " +
                "where b.form = UUID_TO_BIN(?) " +
                "and a.app_grp_id = b.app_grp_id " +
                "group by b.app_grp_id";
            queryParam = [formId];
        }

        console.log('Classes Query ', query);
        console.log('Classes Query queryParam', queryParam);
        const response = await db.query(query, queryParam);
        console.log('student counts ', response);

        let returnData = [];
        for (let i = 0; i < response.length; i++) {
            let row = response[i];
            returnData.push({ name: row.name, y: row.numStudents });
        }

        res.status(200).json({ classData: returnData, formArray: formArray });
    } catch (error) {
        console.log(error);
    }
});

export default router;