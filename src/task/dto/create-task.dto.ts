import { ArrayNotEmpty, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Status } from "../task.interface";

export class CreateTaskDto{
    @IsString({message:"Nazvaniye obyazatelno"})
    @IsNotEmpty()
    task:string;
    
    @IsOptional()
    @IsEmail({},{message:"Not valid Email, Balam Benim"})
    email:string;

    @ArrayNotEmpty({message:"Tag bosdu"})
    @IsString({each:true,message:"Tags are string , xiyarito"})
    tags?:string[];

    
    @IsOptional()
    @IsEnum(Status,{message:"ENUMDI AY BALA"})
    status?:Status; 
}