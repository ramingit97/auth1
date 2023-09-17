import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender, UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { compare, genSaltSync,hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@src/tokens/token.service';
import { IToken } from '@src/tokens/token.interface';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepo:Repository<UserEntity>,
        private jwtService:JwtService,
        private config:ConfigService,
        private tokenService:TokenService,
        ){}


    async register(user:UserCreateDto):Promise<UserEntity>{
        
        //check if already user with email

        let candidate = await this.find(user.login);
        if(candidate){
            throw new HttpException({message:"User with this email already exists"},HttpStatus.FOUND)
        }
        
        const salt = genSaltSync(10);
        const saveUser:Omit<UserEntity,"id"> = {
            email:user.login,
            password:hashSync(user.password,salt),
            gender:Gender.Male
        }

        let result = this.userRepo.save(saveUser);
        console.log(result);
        return result;
    }


    async login(email:string,password:string){
        const user = await this.find(email);
        if(!user){
            throw new NotFoundException({message:"User with email not found"})
        }

        const passwordCompare = await compare(password,user.password);
        if(!passwordCompare){
            throw new HttpException({message:"Password uncorrect"},403)
        }

        let tokens:IToken = await this.tokenService.generateTokens({email,id:user.id})
        await this.tokenService.saveTokens({
            user_id:user.id,
            refresh_token:tokens.refresh_token
        })
        return tokens;
    }


    
    async findAll(){
        const result =  await this.userRepo.find();
        return result;
    }

    async find(email:string):Promise<UserEntity>{
        return this.userRepo.findOne({where:{email}})
    }

    async refresh_token(refreshToken:string){
        const token = await this.tokenService.findToken(refreshToken);
        
        if(!token){
            throw new UnauthorizedException()
        }
        const user = await this.userRepo.findOne({where:{id: token.user_id}});
        if(!user){
            throw new UnauthorizedException()
        }

        const tokens = await this.tokenService.refreshToken({email:user.email,id:user.id},refreshToken);
        await this.tokenService.saveTokens({
            user_id:user.id,
            refresh_token:tokens.refresh_token
        })
        return tokens;
    }
}
