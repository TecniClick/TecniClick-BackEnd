import { UserRole } from 'src/enums/UserRole.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    nullable: false,
  })
  role: UserRole;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'text',
    default:
      'https://www.shutterstock.com/image-vector/default-avatar-profile-social-media-600nw-1920331226.jpg',
  })
  imgUrl: string;

  //El join table va del lado de categorías
  // @ManyToMany(() => Categories, (category) => category.users, {
  //   cascade: true,
  // })
  // @JoinTable({
  //   name: 'user_categories',
  //   joinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'category_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // interests: Categories[];
}
