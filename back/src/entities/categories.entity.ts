import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceProfile } from "./serviceProfile.entity";
import { User } from "./user.entity";

@Entity({
    name: 'categories'
})
export class Categories {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    name: string

    @Column({ 
        type: 'text', 
        nullable: true 
    })
    description: string;

    @ManyToMany(() => ServiceProfile, (serviceProfile) => serviceProfile.category)
    serviceProfile: ServiceProfile[];

    @ManyToMany(() => User, (user) => user.interests)
    users: User[]
}