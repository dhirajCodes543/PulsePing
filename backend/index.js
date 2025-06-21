import express from "express";
import mongoose from "mongoose";
import authenticateFirebaseToken from "./middlewares/authMiddleware.js";
import userRouter from "./routers/signup.js";
import urlRouter from "./routers/url.js";
import cron from  "node-cron"
import { checkAllUrl } from "./service/urlMoniter.js";
import userUrlRouter from "./routers/userUrl.js"
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 9000;

let monitorCronJob

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    monitorCronJob=cron.schedule("*/5 * * * *", async () => {
      try {
        await checkAllUrl();      // make sure the name matches your import
      } catch (err) {
        console.error("Cron job error:", err.message);
      }
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });


app.use(express.json());

app.get("/api/ping", (req, res) => res.json({ ok: true }));
app.use(authenticateFirebaseToken);

app.use("/api/user",userRouter);
app.use("/api/users",userUrlRouter);
app.use("/api/url",urlRouter);

process.on("SIGINT", async () => {
  console.log("\n🛑 Caught SIGINT (Ctrl+C). Cleaning up...");

  try {
    if(monitorCronJob){
    monitorCronJob.stop();
    }
    console.log(" Cron job stopped.");

    await mongoose.connection.close();
    console.log("MongoDB disconnected.");
  } catch (err) {
    console.error("Error during shutdown:", err.message);
  }

  process.exit(0); 
});
