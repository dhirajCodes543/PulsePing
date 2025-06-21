import admin from "firebase-admin";
import fs from "fs";


const serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/pulsepingadmin.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
