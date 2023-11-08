import { IS_LENGTH, IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class UserCreateDto{
    @IsEmail()
    email:string;

    @IsString()
    @IsNotEmpty()
    name:string;
    
    @IsNotEmpty()
    @Matches(/[a-zA-Z0-9\d]{5,}/,{message:"Too weak password"})    
    password:string
}