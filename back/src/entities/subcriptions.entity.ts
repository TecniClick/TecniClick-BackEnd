import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity({
    name: 'subscriptions'
})
export class Subcriptions {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({type: 'enum', enum: Subcriptions, default: 'free'})
    subscriptionType: string

    @Column({type: 'boolean', default: false})
    paymentStatus: boolean

    @CreateDateColumn({type: 'timestamp'})
    startDate: Date

    @Column({type: 'timestamp', nullable: true})
    expirationDate: Date
}