import {config} from "dotenv";
import rateLimit from "express-rate-limit";

config();

const LOGIN_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) * 60 * 1000 || 60 * 1000; // default : 1 minutes
const LOGIN_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX) || 10; // default : 10

export const rateLimiter = rateLimit({
    windowMs: LOGIN_WINDOW_MS,
    max: LOGIN_MAX_REQUESTS,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after a minute."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
