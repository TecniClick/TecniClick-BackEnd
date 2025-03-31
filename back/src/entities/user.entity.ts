import { UserRole } from 'src/enums/UserRole.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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
  email: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  phone: string;

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
    nullable: false,
  })
  role: UserRole;

  @ManyToMany(() => Categories, (category) => category.users)
  interests: Categories[]

  @OneToMany(() => Appointment, (appointment) => appointment.users)
  appointments: Appointment[];
  
  @Column({
    type: 'text',
    default:
      'https://www.shutterstock.com/image-vector/default-avatar-profile-social-media-600nw-1920331226.jpg',
    })
    imgUrl: string;
    
    @OneToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.user)
    serviceProfile: ServiceProfile
    
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]
    
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
