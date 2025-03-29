import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { AppointmentStatus } from "src/enums/AppointmentStatus.enum";
import { ServiceProviders } from "./serviceProvider.entity";

@Entity({
    name: 'appointments'
})
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    // CREAR ENTIDAD ONE TO MANY EN USER Y PROVIDER
    // @ManyToOne(() => User, (user) => user.appointmentsAsSeeker)
    // @JoinColumn({ name: 'seeker_id' })
    // Buscador: User;

    @ManyToOne(() => ServiceProviders, (providers) => providers.appointments)
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    @Column({ type: 'timestamp', nullable: false })
    appointmentDate: Date;

    @Column({ type: 'enum', enum: AppointmentStatus, default: 'Pending' , nullable: false})
    status: string;

    @Column({ type: 'text', nullable: true })
    dditionalNotes: string;

    
}