import type { Db } from '../db/index';
export declare function startSession(db: Db): (args: {
    title: string;
    ai_tool?: string;
}) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare function listSessions(db: Db): (args: {
    limit?: number;
}) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare function getSessionHistory(db: Db): (args: {
    session_id: string;
    limit?: number;
}) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
