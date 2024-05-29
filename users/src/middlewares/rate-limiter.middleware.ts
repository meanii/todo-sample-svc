import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: `draft-7`,
    legacyHeaders: true,
    message: `Too many requests from this IP, please try again after 15 minutes`,
    handler: (_req, res) => {
        res.status(429).json({ status: 429, message: `Too many requests from this IP, please try again after 15 minutes` })
    },
})