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
    enum: SubcriptionStatus,
    default: SubcriptionStatus.PENDING,
  })
  @IsEnum(SubcriptionStatus)
  @IsOptional()
  status: SubcriptionStatus;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
  })
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
