import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { Categories } from 'src/entities/categories.entity';
import { User } from 'src/entities/user.entity';
import { AddressDto } from '../generalDtos/address.dto';

export class ServiceProfileToSaveDto {
  serviceTitle: string;

  userName: string;

  @ApiProperty({
    description: 'Dirección del proveedor del servicio',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  description: string;

  appointmentPrice: number;

  phone: string;

  category: Categories;

  user: User;
}
