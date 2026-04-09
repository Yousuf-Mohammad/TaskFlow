export declare const ACTION_TYPES: {
    readonly TASK_CREATED: "TASK_CREATED";
    readonly TASK_UPDATED: "TASK_UPDATED";
    readonly TASK_DELETED: "TASK_DELETED";
    readonly STATUS_CHANGED: "STATUS_CHANGED";
    readonly ASSIGNMENT_CHANGED: "ASSIGNMENT_CHANGED";
};
export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];
