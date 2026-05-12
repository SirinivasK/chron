export type SetupStatus = 'added' | 'already' | 'skipped' | 'error';
export interface SetupResult {
    tool: string;
    status: SetupStatus;
    path?: string;
    error?: string;
}
export declare function runSetup(): Promise<SetupResult[]>;
