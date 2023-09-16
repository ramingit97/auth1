export enum Status{
    CREATED="created",
    PROCESSING="processing",
    ERROR="error",
}

export interface ITask{
    id:number;
    task:string;
    email?:string;
    status?:Status;
    tags?:string[];
    createdAt:Date;
    updatedAt:Date;
}