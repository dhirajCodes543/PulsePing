import { Router } from "express";
import USER from "../models/userSchema.js";
import admin from "../firebaseAdmin.js";

const router = Router();

router.post("/signup", async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ error: "User missing" });
    }
    const firebaseUid = req.user.uid;
    try {

        const firebaseUser = await admin.auth().getUser(firebaseUid);
        const newUser = await USER.create({
            firebaseUid,
            email: firebaseUser.email,
        })

        res.status(201).json({ message: "User Created,", user: newUser })

    } catch (error) {
        console.error("Signup Error", error);
        res.status(500).json({ error: error.message });
    }
})

export default router;