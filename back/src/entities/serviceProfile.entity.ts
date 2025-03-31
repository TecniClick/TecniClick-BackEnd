import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categories } from "./categories.entity";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";
import { Media } from "./media.entity";
import { Review } from "./reviews.entity";
import { Subscriptions } from "./subcriptions.entity";
import { Order } from "./orders.entity";

@Entity({
    name: 'service_profiles'
})
export class ServiceProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => User, (user) => user.serviceProfile)
    @JoinColumn({name: 'user_id'})
    user: User

    @OneToMany(() => Appointment, (Appointment) => Appointment.provider)
    appointments: Appointment

    @Column({type: 'varchar', length: 100})
    name: string

    @OneToMany(() => Review, (review) => review.serviceProfile)
    reviews: Review[]

    @Column({type: 'varchar', nullable: true})
    address: string

    @Column({ type: 'float', default: 1, nullable: false })
    rating: number;

    @ManyToOne(() => Categories, (category) => category.serviceProfile)
    category: Categories;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', nullable: true })
    priceForConsult: number;

    @OneToMany(() => Media, (media) => media.serviceProfile)
    images: Media[];

    @OneToOne(() => Subscriptions, (subscription) => subscription.serviceProfile)
    subscription: Subscriptions;

    @OneToMany(() => Order, (order) => order.serviceProfile)
    orders: Order[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}