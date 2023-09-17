import {Entity,Column,PrimaryGeneratedColumn} from 'typeorm'

export enum Gender{
    Male,
    Female
}

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;


    @Column("enum",{enum:Gender})
    gender:Gender;

}
