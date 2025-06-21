import { Router } from "express";
import URL from "../models/urlSchems.js";
import USER from "../models/userSchema.js";

const router = Router();

router.post("/ping-api", async (req, res) => {
    if (!req.body.url) {
        return res.status(403).json({ ERROR: "url missing" });
    }
    if (!req.user) {
        console.log(req);
        return res.json({ error: "User missing" });
    }
    const firebaseUid = req?.user.uid;
    console.log(firebaseUid);
    
    let user = await USER.findOne({ firebaseUid });
    if (!user) {
        return res.status(400).json({ Error: "SignUp first to use service" });
    }
    const url = req.body.url?.trim();

    try {
        const urls = await URL.countDocuments({ userId: user._id })
        if(urls>=10){
            return res.status(400).json({msg:"Only 10 accouts per user is allowed"});
        }

        const now = new Date();
        const urlData = await URL.create({
            url,
            userId: user._id,
            status:"unknown",
            lastChecked:now,
            responseTime:null
        })

        console.log("Url Data", urlData);
        res.status(201).json(urlData);

    } catch (error) {
        console.error('Add-URL error →', error.message);
        res.status(400).json({ error: error.message });
    }
})

export default router;