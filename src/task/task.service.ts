import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ITask } from './task.interface';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { STATUS_CODES } from 'http';
import { HttpTaskNotFoundException } from './exceptions/not-found-task.exception';

@Injectable()
export class TaskService {

    private tasks:ITask[] = []

    getTasks():ITask[]{
        return this.tasks;
    }

    createTask({task,email,tags,status}:CreateTaskDto):ITask{
        const newTask = new Task(task,email,tags,status);
        this.tasks.push(newTask)
        return newTask; 
    }

    getTaskById(id:number):ITask{
        let findTask =  this.tasks.find(t=>t.id==id);
        if(!findTask){
            throw new HttpTaskNotFoundException({error:"Tapilmadi"});
        }
        return findTask;
    }

    getTaskByEmail(email:string):ITask[]{
        return this.tasks.filter(t=>t.email===email);
    }

}
