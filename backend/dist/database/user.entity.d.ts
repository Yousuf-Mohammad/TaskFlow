export declare enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}
