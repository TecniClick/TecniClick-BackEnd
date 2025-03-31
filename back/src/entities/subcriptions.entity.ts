import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ServiceProfile } from "./serviceProfile.entity";
import { SubcriptionStatus } from "src/enums/subscriptionStatus.enum";
import { Order } from "./orders.entity";
import { SubscriptionsType } from "src/enums/Subscriptions.enum";


@Entity({
    name: 'subscriptions'
})
export class Subscriptions {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.subscription)
    serviceProfile: ServiceProfile;

    @Column({type: 'enum', enum: SubscriptionsType, default: 'free'})
    subscriptionType: SubscriptionsType

    @Column({type: 'enum', enum: SubcriptionStatus, default: 'pending'})
    status: SubcriptionStatus

    @OneToMany(() => Order, (order) => order.subscription)
    orders: Order[]

    @CreateDateColumn()
    createdAt: Date

    @Column({type: 'timestamp', nullable: true})
    startDate: Date

    @Column({type: 'timestamp', nullable: true})
    expirationDate: Date
}