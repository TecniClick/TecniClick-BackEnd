import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProfile } from './serviceProfile.entity';
import { MediaType } from 'src/enums/mediaType.enum';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  imgUrl: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.GALLERY,
  })
  type: MediaType;

  @Column({ type: 'varchar', nullable: false })
  publicId: string;

  @Column({ type: 'varchar', nullable: false })
  resourceType: 'image' | 'video' | 'raw';

  @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.images)
  @JoinColumn({ name: 'serviceProfile_id' })
  serviceProfile: ServiceProfile;
}
