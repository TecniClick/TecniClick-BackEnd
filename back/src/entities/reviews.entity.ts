import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { User } from './user.entity';
import { ServiceProfile } from './serviceProfile.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de borrado lógico del review',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @OneToOne(() => Appointment, (appointment) => appointment.review)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ServiceProfile, (ServiceProfile) => ServiceProfile.reviews)
  @JoinColumn({ name: 'serviceProfile_id' })
  serviceProfile: ServiceProfile;
}
