import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import { Request } from 'express';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';

@ApiTags('Endpoints de Ordenes de Pago')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create-intent')
  @ApiBody({ type: CreatePaymentDto })
  async createPaymentIntentController(
    @Body() suscriptionData: CreatePaymentDto,
    @GetUser() userOfToken: IJwtPayload,
  ) {
    const paymentIntent = await this.ordersService.createPaymentIntentService(
      suscriptionData,
      userOfToken,
    );
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  @Post('webhook')
  async handleStripeWebhookController(
    @Req() request: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    const body = (request as RawBodyRequest<Request>).rawBody;
    return await this.ordersService.handleStripeWebhookService(body, signature);
  }
}
