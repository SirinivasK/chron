import type { Db } from '../db/index';
export declare function logMessage(db: Db): (args: {
    session_id: string;
    role: "user" | "assistant";
    content: string;
}) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function logExchange(db: Db): (args: {
    session_id: string;
    user_content: string;
    assistant_content: string;
}) => Promise<{
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
