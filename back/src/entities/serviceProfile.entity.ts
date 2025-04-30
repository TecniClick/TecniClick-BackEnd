import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';
import { Media } from './media.entity';
import { Review } from './reviews.entity';
import { Subscriptions } from './subcriptions.entity';
import { Order } from './orders.entity';
import { ServiceProfileStatus } from 'src/enums/serviceProfileStatus.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

@Entity({
  name: 'service_profiles',
})
export class ServiceProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  serviceTitle: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  userName: string;

  @Column('jsonb', { nullable: false })
  address: {
    extNumber: string;
    intNumber?: string;
    street: string;
    neighborhood?: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };

  @Column({ type: 'float', default: null, nullable: true })
  rating: number | null;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', nullable: false })
  appointmentPrice: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: ServiceProfileStatus,
    default: ServiceProfileStatus.PENDING,
  })
  status: ServiceProfileStatus;

  @ApiProperty({
    description: 'Imagen de perfil del usuario',
    example: 'https://example.com/images/headphones.jpg',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  @IsUrl()
  profilePicture: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @OneToOne(() => User, (user) => user.serviceProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(
    () => Subscriptions,
    (subscription) => subscription.serviceProfile,
    // {
    //   cascade: true,
    //   onDelete: 'CASCADE',
    // },
  )
  subscription: Subscriptions;

  @OneToMany(() => Appointment, (Appointment) => Appointment.provider)
  appointments: Appointment;

  @OneToMany(() => Review, (review) => review.serviceProfile)
  reviews: Review[];

  @OneToMany(() => Media, (media) => media.serviceProfile)
  images: Media[];

  @ManyToOne(() => Categories, (category) => category.serviceProfile, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Categories;
}
