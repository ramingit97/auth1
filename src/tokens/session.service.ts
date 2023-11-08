import { Injectable } from "@nestjs/common";
import {Redis} from "ioredis"
const redisClient = new Redis({
    host: 'localhost', // Замените на ваш адрес Redis
    port: 6379, // Замените на ваш порт Redis
    // Другие параметры подключения к Redis, если необходимо
});

@Injectable()
export class SessionService {
    async getUserFromSession(sessionId:string) {
      const userData = await redisClient.get(sessionId);
  
      if (userData) {
        // Ваш формат данных сессии может отличаться; здесь предполагается, что данные сессии являются JSON
        const sessionData = JSON.parse(userData);
        return sessionData.user;
      }
  
      return null;
    }
}