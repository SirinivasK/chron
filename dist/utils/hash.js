"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeContentHash = computeContentHash;
const crypto_1 = require("crypto");
function computeContentHash(sessionId, role, content, createdAt, prevHash) {
    return (0, crypto_1.createHash)('sha256')
        .update(`${sessionId}|${role}|${content}|${createdAt}|${prevHash ?? ''}`)
        .digest('hex');
}
