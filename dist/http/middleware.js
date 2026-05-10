"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = apiKeyMiddleware;
function apiKeyMiddleware(apiKey) {
    return (req, res, next) => {
        const header = req.headers.authorization;
        if (!header || header !== `Bearer ${apiKey}`) {
            res.status(401).end();
            return;
        }
        next();
    };
}
