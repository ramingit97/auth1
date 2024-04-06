import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpxExceptionFilter } from './exception-filters/all.filter';
import { HttpExceptionFilter } from './exception-filters/http.filter';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // // const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;
  // // console.log('2222222',port);
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     host: 'user-service',
  //     port
  //   },
  // });
  // app.useGlobalFilters(new HttpExceptionFilter())
  // app.useGlobalFilters(new RpxExceptionFilter())
  // // app.use(cookieParser())
  // await app.listen();




  // const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: 'post-service2',
  //       port: 6000,
  //     },
  //   },
  // );
  // const rmqService = appTcp.get<RmqService>(RmqService);
  // const appRmq = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   rmqService.getOptions('post_queue2')
  // );

  // await appTcp.listen();
  // await appRmq.listen();
  const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    // {
    //   transport: Transport.TCP,
    //   options: {
    //     host: 'order-service',
    //     port: 6000,
    //   },
    // },
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `auth-consumer`,
          brokers: ['kafka-0:9092','kafka-1:9092'],
        },
        consumer: {
          groupId: 'auth-consumer',
        },
      },
    },

    
  );
  console.log('aa11');
  
  appTcp.listen();


   // Создаем веб-приложение для HTTP
   const httpApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
      transport: Transport.TCP,
      options: {
        host: 'user-service',
        port:4000
      },
   });

   appTcp.useGlobalFilters(new HttpExceptionFilter())
   appTcp.useGlobalFilters(new RpxExceptionFilter())
   // Запускаем веб-приложение для HTTP
   httpApp.listen();

}
bootstrap();
