import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { dataSource } from './ormconfig';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'./.development.env'
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:()=>dataSource.options
    }),
    TaskModule,
    UserModule,
    TokensModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
