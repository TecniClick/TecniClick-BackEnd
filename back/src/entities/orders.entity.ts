import { ServiceProfile } from './serviceProfile.entity';
import { Subscriptions } from './subcriptions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ type: 'int', unique: true, generated: 'increment' })
  invoice: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Subscriptions, (subscription) => subscription.orders)
  @JoinColumn({ name: 'suscription_id' })
  subscription: Subscriptions;

  @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.orders)
  @JoinColumn({ name: 'serviceProfile_id' })
  serviceProfile: ServiceProfile;
}
