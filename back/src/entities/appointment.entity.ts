import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AppointmentStatus } from 'src/enums/AppointmentStatus.enum';
import { ServiceProfile } from './serviceProfile.entity';
import { Review } from './reviews.entity';

@Entity({
  name: 'appointments',
})
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  appointmentStatus: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  additionalNotes: string;

  @OneToOne(() => Review, (review) => review.appointment)
  review: Review;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  users: User;

  @ManyToOne(
    () => ServiceProfile,
    (serviceProfile) => serviceProfile.appointments,
  )
  @JoinColumn({ name: 'serviceProfile_id' })
  provider: ServiceProfile;
}
