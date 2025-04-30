import { ApiProperty } from '@nestjs/swagger';

export class UpgradeToAdminDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}
