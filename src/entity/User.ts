import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 200})
    firstName: string;

    @Column()
    lastName: string;

    @Column({default: 18})
    age: number;
}