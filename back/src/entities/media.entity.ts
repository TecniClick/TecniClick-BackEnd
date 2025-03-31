import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServiceProfile } from "./serviceProfile.entity";


@Entity({name: 'media'})
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.images)
    serviceProfile: ServiceProfile

    @Column({type: 'varchar'})
    imgUrl: string
}