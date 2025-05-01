import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  RawBodyRequest,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import { Request } from 'express';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { Order } from 'src/entities/orders.entity';
import { CreateOrderDto } from 'src/DTO/ordersDtos/createOrder.dto';
import { AuthGuard } from 'src/Auth/guards/auth.guard';

@ApiTags('Endpoints de Ordenes de Pago')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // OBTENER TODAS LAS ÓRDENES EXISTENTES
  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes existentes' })
  // @ApiBearerAuth()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  getAllOrdersController() {
    return this.ordersService.getAllOrdersService();
  }

  // CREAR UNA ORDEN
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiBody({ type: CreateOrderDto })
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  createOrderController(@Body() order: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrderService(order);
  }

  @Post('create-intent')
  @ApiOperation({ summary: 'Crear intención de pago para una suscripción' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
  @ApiOperation({ summary: 'Webhook para recibir eventos de Stripe' })
  async handleStripeWebhookController(
    @Req() request: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log('Se comenzó a ejecutar el controller de webhook');
    const body = request.body as Buffer;
    return await this.ordersService.handleStripeWebhookService(body, signature);
  }

  // OBTENER ORDEN POR ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID de la orden',
    required: true,
  })
  getOrderByIdController(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrderByIdService(id);
  }
}
