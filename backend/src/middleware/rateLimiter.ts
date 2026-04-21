import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Very high limit to remain hackathon-friendly
  message: {
    success: false,
    message: 'Too many requests generated from this IP, please try again later.'
  }
});
