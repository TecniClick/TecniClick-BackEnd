import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProfile } from './serviceProfile.entity';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { Order } from './orders.entity';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

@Entity({
  name: 'subscriptions',
})
export class Subscriptions {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Tipo de suscripción',
    example: 'free',
  })
  @Column({
    type: 'enum',
    enum: SubscriptionsType,
    default: SubscriptionsType.FREE,
  })
  @IsEnum(SubscriptionsType)
  @IsOptional()
  subscriptionType: SubscriptionsType;

  @ApiProperty({
    description: 'Estado de la suscripción',
    example: 'pending',
  })
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Fecha de pago de la suscripción Premium',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  paymentDate: Date | null;

  @ApiProperty({
    description: 'Fecha de expiración del pago de suscripción Premium',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  expirationDate: Date | null;

  @ApiProperty({
    description: 'Fecha de inicio de suscripción Premium',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  createdPremiumAt: Date | null;

  @OneToOne(
    () => ServiceProfile,
    (serviceProfile) => serviceProfile.subscription,
  )
  @JoinColumn({ name: 'suscription_id' })
  serviceProfile: ServiceProfile;

  @OneToMany(() => Order, (order) => order.subscription)
  orders: Order[];
}
