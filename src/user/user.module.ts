import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from '@src/tokens/token.service';
import { TokenEntity } from '@src/tokens/token.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity,TokenEntity]),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>({
                secret:config.get<string>("JWT_SECRET")
            })
        })
    ],
    providers: [UserService,TokenService],
    controllers:[UserController]
})
export class UserModule {}
