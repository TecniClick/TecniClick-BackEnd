import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderStatus } from 'src/enums/orderStatus.enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Monto del pago',
    example: 1000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'ID del intent de pago (Stripe u otro proveedor)',
    example: 'pi_1N9s5uFvZLQdKgxWlGHY7uY2',
  })
  @IsNotEmpty()
  @IsString()
  paymentIntentId: string;

  @ApiProperty({
    description: 'Estado del pedido',
    enum: OrderStatus,
    default: OrderStatus.SUCCEEDED,
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus = OrderStatus.SUCCEEDED;
}
