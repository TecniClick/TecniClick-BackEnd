import { UserRole } from 'src/enums/UserRole.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { ServiceProfile } from './serviceProfile.entity';
import { Appointment } from './appointment.entity';
import { Review } from './reviews.entity';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

@Entity({
  name: 'users',
})
export class User {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Edu Cardi',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario (Debe ser único)',
    example: 'educardi@mail.com',
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Index()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'hashedpassword123',
  })
  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Número telefónico del usuario',
    example: 1234567890,
  })
  @Column({
    type: 'bigint',
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: '1234 Elm Street, NY',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'customer',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @IsEmpty()
  updatedAt: Date;

  @ApiProperty({
    description: 'Fecha de borrado lógico del usuario',
  })
  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @OneToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.user)
  serviceProfile: ServiceProfile;

  @OneToMany(() => Appointment, (appointment) => appointment.users)
  appointments: Appointment[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @ManyToMany(() => Categories, (category) => category.users, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'users_categories',
    joinColumn: {
      name: 'users_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  interests: Categories[];
}
