import { Router } from "express";
import USER from "../models/userSchema.js";
import URL from "../models/urlSchems.js";

const router = Router();

router.get("/analytics", async (req, res) => {
    if (!req.user) {
        return res.json({ error: "User missing" });
    }
    const firebaseUid = req?.user.uid;
    
    let user = await USER.findOne({ firebaseUid });
    if (!user) {
        return res.status(401).json({ Error: "SignUp first to use service" });
    }

    try {

        const urls = await URL.find({ userId: user._id })
            .sort({ createdAt: -1 })


        return res.json({ urls })

    } catch (error) {
        console.error("Analytics route error:", err);
        res.status(500).json({ error: "Server error" });
    }

})

export default router