import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Tipo de suscripción', example: 'premium' })
  @IsEnum(SubscriptionsType)
  subscriptionType: SubscriptionsType;

  @ApiProperty({
    description: 'Descripción de la suscripción',
    example: 'Una suscripción Premium que incluye promociones',
  })
  @IsString()
  description: string;
}
