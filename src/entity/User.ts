import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm"
import { Role } from "./Role";

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

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({name: "user_roles"})
    roles: Role[]
}