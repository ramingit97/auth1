import { ITask, Status } from "./task.interface";

export class Task implements ITask{
    id: number = new Date().getTime();
    createdAt: Date = new Date()
    updatedAt: Date = new Date();

    constructor(
        public task:string,
        public email:string,
        public tags?:string[],
        public status?:Status) {
    }    
}