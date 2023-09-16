import { Body, Controller, Get, Param, ParseIntPipe, Post, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ITask } from './task.interface';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { EmailPipe } from './pipes/email.pipe';
import { AllExceptionFilter } from '@src/exception-filters/all.filter';

@UseFilters(AllExceptionFilter)
@Controller('task')
export class TaskController {


    constructor(private service:TaskService) { }
    

    @Get()
    getTasks():ITask[]{
        return this.service.getTasks()
    }

    @UsePipes(ValidationPipe)
    @Post()
    createTask(@Body('') task:CreateTaskDto ):ITask{
        console.log("rrr")
        return this.service.createTask(task);
    }


    @Get(":id")
    getTaskById(@Param("id",ParseIntPipe) id:number){
        return this.service.getTaskById(id);
    }


    @Get("email/:email")
    getTaskByEmail(@Param("email",EmailPipe) email:string){
        return this.service.getTaskByEmail(email);
    }
}
