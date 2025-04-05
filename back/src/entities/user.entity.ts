import { UserRole } from 'src/enums/UserRole.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { ServiceProfile } from './serviceProfile.entity';
import { Appointment } from './appointment.entity';
import { Review } from './reviews.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Index()
  email: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  phone: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    type: 'text',
    default:
      'https://www.shutterstock.com/image-vector/default-avatar-profile-social-media-600nw-1920331226.jpg',
  })
  imgUrl: string;

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

  @OneToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.user)
  serviceProfile: ServiceProfile;

  @OneToMany(() => Appointment, (appointment) => appointment.users)
  appointments: Appointment[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @ManyToMany(() => Categories, (category) => category.users, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'users_categories',
    joinColumn: {
      name: 'users_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  interests: Categories[];
}
