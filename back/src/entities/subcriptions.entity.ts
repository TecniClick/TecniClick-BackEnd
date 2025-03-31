import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProfile } from './serviceProfile.entity';
import { SubcriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { Order } from './orders.entity';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';

@Entity({
  name: 'subscriptions',
})
export class Subscriptions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionsType,
    default: SubscriptionsType.FREE,
  })
  subscriptionType: SubscriptionsType;

  @Column({
    type: 'enum',
    enum: SubcriptionStatus,
    default: SubcriptionStatus.PENDING,
  })
  status: SubcriptionStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(
    () => ServiceProfile,
    (serviceProfile) => serviceProfile.subscription,
  )
  @JoinColumn({ name: 'suscription_id' })
  serviceProfile: ServiceProfile;

  @OneToMany(() => Order, (order) => order.subscription)
  orders: Order[];
}
