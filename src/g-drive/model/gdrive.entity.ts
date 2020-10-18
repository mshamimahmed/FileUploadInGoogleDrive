import { Entity,PrimaryGeneratedColumn,Column, OneToMany } from "typeorm";
@Entity()
export class Gdrive {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true })
    firstName: string;

    @Column({nullable: true })
    lastName: string;

    @Column({nullable: true,unique:true ,})
    gmail: string; 

    @Column({nullable: true ,unique:true})
    fileId: string;


}