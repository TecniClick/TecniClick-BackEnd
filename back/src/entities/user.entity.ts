import { UserRole } from "src/enums/UserRole.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: "varchar"})
    name: string

    @Column({type: 'varchar'})
    email: string

    @Column({type: 'varchar'})
    password: string

    @Column({type: 'varchar'})
    phone: string

    @Column({type: 'enum', enum: UserRole, default: UserRole.CUSTOMER})
    role: UserRole

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date;
}