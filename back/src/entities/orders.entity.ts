import { ServiceProfile } from "./serviceProfile.entity";
import { Subscriptions } from "./subcriptions.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'orders'})
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Subscriptions, (subscription) => subscription.orders)
    subscription: Subscriptions

    @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.orders)
    serviceProfile: ServiceProfile;

    @Column({ type: 'decimal' })
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'int', unique: true, generated: 'increment' })
    invoice: number;
}