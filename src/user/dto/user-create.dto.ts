import { IS_LENGTH, IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class UserCreateDto{
    @IsEmail()
    login:string;
    
    @IsNotEmpty()
    @Matches(/[a-zA-Z0-9\d]{5,}/,{message:"Too weak password"})    
    password:string
}