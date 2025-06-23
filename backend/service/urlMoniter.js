import axios from "axios";
import URL from "../models/urlSchems.js";
import { sendAlertEmail } from "./mailer.js";
import USER from "../models/userSchema.js";
import pLimit from 'p-limit'

const limit = pLimit(50);

const checkUrl = async (urlDoc) => {
    const previousStatus = urlDoc.status;

    try {
        const start = Date.now();
        await Promise.race([
            axios.get(urlDoc.url, { timeout: 3000 }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Hard timeout after 3 seconds')), 3000)
            )
        ]);
        const end = Date.now();

        urlDoc.status = "up";
        urlDoc.responseTime = end - start;
    } catch (error) {
        urlDoc.status = "down";
        urlDoc.responseTime = null;
    }

    urlDoc.lastChecked = new Date();
    await urlDoc.save();
    
    if (
        previousStatus !== "down" && urlDoc.status === "down" && urlDoc.userId?.email
    ) {
        try {
            await sendAlertEmail(
                urlDoc.userId.email,
                "🔴 Pulse Ping Alert - Your API is DOWN",
                `We could not reach ${urlDoc.url} at ${new Date().toLocaleString()}.`
            );
            console.log(`📧 Alert sent to ${urlDoc.userId.email}`);
        } catch (err) {
            console.error("❌ Failed to send alert email:", err.message);
        }
    }
}

export async function checkAllUrl() {
    try {
        const urls = await URL.find().populate("userId", "email");
        const tasks = urls.map((url) => limit(() => checkUrl(url)));
        await Promise.allSettled(tasks);
        // console.log(`[${new Date().toLocaleTimeString()}] Checked ${urls.length} URLs`);
    } catch (error) {
        console.error("🚨 Error checking URLs:", error.message);
    }
}