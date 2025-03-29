import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServiceCategory } from "./serviceCategories.entity";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";
import { Reviews } from "./reviews.entity";

@Entity({
    name: 'service_profiles'
})
export class ServiceProviders {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Appointment, (appointment) => appointment.provider)
    appointments: Appointment[];

    @Column({
        type: "text",
        nullable: false
    })
    serviceDescription: string

    @ManyToMany(() => ServiceCategory, (category) => category.providers)
    categories: ServiceCategory[];

    @Column({ type: 'text', array: true, default: '{}' })
    workPhotos: string[];

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'float', nullable: true, default: 0 })
    averageRating: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    website: string;

    @OneToMany(() => Reviews, (review) => review.providerProfile)
    reviews: Reviews[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createdAt: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deletedAt: Date


}