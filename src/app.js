import express from "express";
import cors from "cors";

const corsOption = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
};

const app = express();

app.use(cors(corsOption));
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ limit: "24kb", extended: true }));

// Routes Import
import contactRouter from "../routes/contact.routes.js";

//Routes
const api_v1 = "/api/v1";

app.use(`${api_v1}/contact`, contactRouter);

export { app };
