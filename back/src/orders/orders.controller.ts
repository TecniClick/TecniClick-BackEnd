import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';

@ApiTags('Endpoints de Ordenes')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create-intent')
  @ApiBody({ type: CreatePaymentDto })
  async createPaymentIntentController(
    @Body() suscriptionData: CreatePaymentDto,
  ) {
    const paymentIntent =
      await this.ordersService.createPaymentIntentService(suscriptionData);
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}
