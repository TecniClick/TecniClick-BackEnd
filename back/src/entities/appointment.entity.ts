import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { AppointmentStatus } from "src/enums/AppointmentStatus.enum";
import { ServiceProfile } from "./serviceProfile.entity";

@Entity({
    name: 'appointments'
})
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.appointments)
    users: User;

    @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.appointments)
    provider: ServiceProfile;

    @Column({ type: 'timestamp', nullable: false })
    date: Date;

    @Column({ type: 'enum', enum: AppointmentStatus, default: 'Pending' , nullable: false})
    appointmentStatus: string;

    @Column({ type: 'text', nullable: true })
    additionalNotes: string;

    
}