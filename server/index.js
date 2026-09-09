import dotenv from 'dotenv';
dotenv.config(); // 👈 Sabse pehle env load hoga

import dns from 'node:dns/promises';
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from 'express';
import connectDb from './utils/connectDb.js';
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import notesRouter from './routes/generate.route.js';
import pdfRouter from './routes/pdf.route.js';
// 1. Payment Route Import Karo
import paymentRouter from './routes/payment.route.js'; 

const app = express();

// Security headers
app.use(helmet());

// CORS — use CLIENT_URL from env for production, fallback for dev
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize({
  replaceWith: '_'
})); // Strip $ and . from req.body/query/params safely

// Rate limiter — 100 requests per 15 minutes per IP on all /api/ routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again after 15 minutes." }
});
app.use("/api", apiLimiter);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.json('NotesKaro Backend Running');
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/pdf", pdfRouter);
// 2. Payment Route Register Karo
app.use("/api/payment", paymentRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
