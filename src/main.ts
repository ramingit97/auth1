import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpxExceptionFilter } from './exception-filters/all.filter';
import { HttpExceptionFilter } from './exception-filters/http.filter';
import { TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;
  // console.log('2222222',port);
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'user-service',
      port
    },
  });
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new RpxExceptionFilter())
  // app.use(cookieParser())
  await app.listen();

}
bootstrap();
