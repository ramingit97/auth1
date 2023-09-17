import { Body, Controller, Get, Header, Headers, HttpException, HttpStatus, Post, Request, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CookieOptions, Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from '@src/guards/auth.guard';
import { IToken } from '@src/tokens/token.interface';
import { Cookie } from '@src/decorators/cookie.decorator';
import { Agent } from '@src/decorators/agent.decorator';

@Controller('user')
export class UserController {
    
    constructor(private userService:UserService){}

    @UsePipes(ValidationPipe)
    @Post("register")
    async register(@Body() userData:UserCreateDto):Promise<UserEntity>{
        console.log('user',userData)
        return await this.userService.register(userData);
    }


    @Post("login")
    async login(@Body() userData:UserCreateDto,@Res() res:Response){
        let tokens = await this.userService.login(userData.login,userData.password);
        await this.setRefreshCookie(tokens.refresh_token,res);
        res.status(HttpStatus.CREATED).json(tokens);
    }

    async setRefreshCookie(token:string,res:Response){
        if(!token){
            throw new UnauthorizedException({message:"Token not found"});
        }
        let cookieOptions:CookieOptions = {
            maxAge:30 * 24 *60 *60 ,// 30 days
            // domain:'/',
            sameSite:'lax',
            secure:false
        }
        res.cookie("refresh_token",token,cookieOptions)
    }

    @UseGuards(AuthGuard)
    @Get("all")
    async findAll(@Request() req:ExpressRequest,@Headers("user-agent") agent2:string):Promise<UserEntity[]>{
        console.log("agent",agent2)
        return await this.userService.findAll();
    }

    @Post("refreshToken")
    async refresh_token(@Res() res:Response,@Request() req:ExpressRequest,@Cookie("refresh_token") token:string){
        console.log("token",token);
        
        const tokens:IToken =  await this.userService.refresh_token(token)
        this.setRefreshCookie(tokens.refresh_token,res);
        res.status(HttpStatus.CREATED).json(tokens);
    }

}
