import type { Db } from '../db/index';
export declare function verifySession(db: Db): (args: {
    session_id: string;
}) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
