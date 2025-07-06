import env from "#config/env/env.js";
import axios from "axios";
import { google } from "googleapis";

export const apiWB = axios.create({
  headers: {
    "Authorization": `Bearer ${env.WB_TOKEN}`,
    "Content-Type": "application/json",
  }
});

export const apiGoogle = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file"
  ],
  credentials: JSON.parse(Buffer.from(env.GOOGLE_CREDENTIALS, "hex").toString())
})
