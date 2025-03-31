import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./appointment.entity";
import { User } from "./user.entity";
import { ServiceProfile } from "./serviceProfile.entity";


@Entity({name: 'reviews'})
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Appointment)
    @JoinColumn({name: 'appointment_id'})
    appointment: Appointment

    @ManyToOne(() => User, (user) => user.reviews)
    user: User

    @ManyToOne(() => ServiceProfile, (ServiceProfile) => ServiceProfile.appointments)
    serviceProfile: ServiceProfile

    @Column({type: 'int', nullable: false})
    rating: number
    
    @Column({type: 'int', nullable: false})
    comment: string

    @CreateDateColumn()
    createdAt: Date
}