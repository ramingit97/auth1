import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log("eee",value,isEmail(value))
    if(!isEmail(value)){
      throw new BadRequestException("Not valid Email, Ay Bala")
    }
    return value;
  }
}
