import { Body, Controller, Get, Header, Headers, HttpException, HttpStatus, Inject, NotFoundException, Post, Request, Res, UnauthorizedException, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CookieOptions, Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from '@src/guards/auth.guard';
import { IToken } from '@src/tokens/token.interface';
import { Cookie } from '@src/decorators/cookie.decorator';
import { Agent } from '@src/decorators/agent.decorator';
import { IAuthResult } from './user.interface';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Ctx, MessagePattern, Payload, RpcException, TcpContext } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@src/tokens/token.service';

@Controller('user')
export class UserController {
    
    constructor(private userService:UserService,
        private jwtService:JwtService,
        private config:ConfigService,
        private tokenService:TokenService
        ){}

    @UsePipes(ValidationPipe)
    @MessagePattern("register")
    async register(@Payload() userData:UserCreateDto){

        console.log('userData userService',userData);
        
        let result = await this.userService.register(userData);
        // await this.setRefreshCookie(result.refresh_token,res);
        return {
            userId:result.user.id,
            access_token:result.access_token,
            refresh_token:result.refresh_token
        }

        // res.status(HttpStatus.CREATED).json({
        //     userId:result.user.id,
        //     access_token:result.access_token
        // });
    }


    @MessagePattern("login")
    async login(@Payload() userData:UserCreateDto){
        let tokens = await this.userService.login(userData.email,userData.password);
        // await this.setRefreshCookie(tokens.refresh_token,res);
        // res.status(HttpStatus.CREATED).json(tokens);
        return {
            ...tokens
        }
    }


    @MessagePattern('token_decode')
    async decode_token(@Payload() tokens:any){
        let token = tokens.access_token;
        let refresh_token = tokens.refresh_token;
        if(!token || !refresh_token){
            throw new UnauthorizedException()
          }
          try{
            // 1) Нужно проверить есть ли вообще данный токен в базе и не revoke ли он и не закончилось его время
            await this.jwtService.verifyAsync(refresh_token,{
              secret:this.config.get<string>("JWT_REFRESH_SECRET")
            })
      

            let findRefreshToken = await this.tokenService.findToken(refresh_token)
            if(!findRefreshToken){
              throw new UnauthorizedException("")
            }


           
            const payload = await this.jwtService.verifyAsync(token,{
              secret:this.config.get<string>("JWT_SECRET")
            })


            let findUserData = this.userService.findUserByEmail(payload.email);
            
            return findUserData;
      
          }
          catch(e){
            console.log('errrrrrrr2222',e);
            
            throw new UnauthorizedException({message:"Session expired"})
          }
    }

    async setRefreshCookie(token:string,res:Response){
        if(!token){
            throw new UnauthorizedException({message:"Token not found"});
        }
        let cookieOptions:CookieOptions = {
            maxAge:30 * 24 *60 *60 ,// 30 days
            // domain:'/',
            sameSite:'strict',
            secure:false
        }
        res.cookie("refresh_token",token,cookieOptions)
    }

    // @UseGuards(AuthGuard)
    @MessagePattern("all")
    async findAll(@Request() req:ExpressRequest,@Headers("user-agent") agent2:string){
        // console.log("agent",agent2)
        console.log('111111111111111111111');
        
        return await this.userService.findAll();
    }


    @MessagePattern("refresh_token")
    async refresh_token(@Payload() userData:any){
        const tokens:IToken =  await this.userService.refresh_token(userData.refresh_token)
        // this.setRefreshCookie(tokens.refresh_token,res);
        // res.status(HttpStatus.CREATED).json(tokens);
        return {
            ...tokens
        }
    
    }

    // @Post("refreshToken")
    // async refresh_token(@Res() res:Response,@Request() req:ExpressRequest,@Cookie("refresh_token") token:string){
    //     console.log("token",token);
        
    //     const tokens:IToken =  await this.userService.refresh_token(token)
    //     this.setRefreshCookie(tokens.refresh_token,res);
    //     res.status(HttpStatus.CREATED).json(tokens);
    // }


    @MessagePattern("create_photo")
    async createPhoto(@Payload() payload){
        console.log("pppppppppppppppppp121212",payload);
        return "ramin"
    }

    @MessagePattern("get.user.info")
    async getUserInfo({id}:{id:number}){
        console.log("get.sdsds.sdsds get.sdsds.info",id);
        let user = await this.userService.findUserById(id);
        console.log("user111",user);
        return JSON.stringify(user);
        // return {
        //     headers: {
        //       "realm0:":1
        //     },
        //     key: "heroId",
        //     value: user
        //   }
    }

    // @MessagePattern("register2")
    // // @UsePipes(ValidationPipe)
    // register2(@Payload() data:UserCreateDto,@Ctx() ctx:TcpContext){
    //     // console.log('cc',ctx);
    //     // console.log('dd',data);
    //     throw new RpcException('An error was thrown');
    //     return {name:'ramin'}
    // }

}
