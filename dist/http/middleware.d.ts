import type { Request, Response, NextFunction } from 'express';
export declare function apiKeyMiddleware(apiKey: string): (req: Request, res: Response, next: NextFunction) => void;
