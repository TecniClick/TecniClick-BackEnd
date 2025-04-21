import { OrderStatus } from 'src/enums/orderStatus.enum';
import { Subscriptions } from './subcriptions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', nullable: true })
  amount: number;

  @Column({ type: 'varchar', nullable: false })
  paymentIntentId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.SUCCEEDED,
  })
  status: OrderStatus;

  @Column({ type: 'int', unique: true, generated: 'increment' })
  invoice: number;

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

  @ManyToOne(() => Subscriptions, (subscription) => subscription.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'suscription_id' })
  subscription: Subscriptions;
}
