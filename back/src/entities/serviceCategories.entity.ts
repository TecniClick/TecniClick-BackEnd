import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceProviders } from "./serviceProvider.entity";

@Entity({
    name: 'service_categories'
})
export class ServiceCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    serviceName: string

    @Column({ 
        type: 'text', 
        nullable: false 
    })
    description: string;

    @ManyToMany(() => ServiceProviders, (profile) => profile.categories)
    providers: ServiceProviders[];
}