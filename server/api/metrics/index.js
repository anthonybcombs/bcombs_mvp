import express from "express";

import { makeDb } from "../../helpers/database";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { id } = req.body;
        const db = makeDb();
        console.log('ID', id)
        const response =  await db.query("SELECT id2,email FROM users where id=UUID_TO_BIN(?)", [id]);

        console.log('Responseee', response)
        res.status(200).json({ user: response && response[0] });
    } catch (error) {

    }
});

export default router;