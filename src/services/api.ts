import env from "#config/env/env.js";
import axios from "axios";
import { google } from "googleapis";

export const apiWB = axios.create({
  headers: {
    "Authorization": env.WB_TOKEN,
    "Content-Type": "application/json"
  },
  baseURL: env.WB_API_URL,
});

export const apiGoogle = new google.auth.GoogleAuth({
  apiKey: env.GOOGLE_API_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});