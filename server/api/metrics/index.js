import express from "express";

import { makeDb } from "../../helpers/database";

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const db = makeDb();

        // await db.query("UPDATE users SET profile_img=? where id=UUID_TO_BIN(?)", [
        //     s3Payload.Key,
        //     currentUser.id
        //   ]);

        res.status(200).json({ message: 'Welcome to metrics api' });
    } catch (error) {

    }
});

export default router;