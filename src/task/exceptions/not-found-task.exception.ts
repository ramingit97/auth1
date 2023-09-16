import { HttpCode, HttpException, HttpStatus } from "@nestjs/common";


interface IError{
    mesage?:never;
    key?:never;
    status?:never;
    [k:string]:string;
}

export class HttpTaskNotFoundException extends HttpException{
    constructor(error:IError=null){
        super({
            mesage:'Task not found',
            key:'task_not_found',
            status:HttpStatus.NOT_FOUND,
            ...error
        },HttpStatus.NOT_FOUND)
    }


}