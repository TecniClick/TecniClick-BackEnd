import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/enums/orderStatus.enum';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { SubscriptionsRepository } from 'src/subscriptions/subscriptions.repository';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { Order } from 'src/entities/orders.entity';
import { CreateOrderDto } from 'src/DTO/ordersDtos/createOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly configService: ConfigService,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  // OBTENER TODAS LAS ÓRDENES EXISTENTES
  async getAllOrdersService() {
    return await this.ordersRepository.getAllOrdersRepository();
  }

  // CREAR UNA ORDEN
  async createOrderService(order: CreateOrderDto): Promise<Order> {
    return await this.ordersRepository.createOrderRepository(order);
  }

  async createPaymentIntentService(
    suscriptionData: CreatePaymentDto,
    userOfToken: IJwtPayload,
  ) {
    // 1. Buscar la suscripción activa del usuario
    const subscription =
      await this.subscriptionsRepository.getSubscriptionByUserIdRepository(
        userOfToken.id,
      );

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada.');
    }

    return await this.ordersRepository.createPaymentIntentRepository(
      suscriptionData,
      'usd',
      subscription.id,
    );
  }

  async handleStripeWebhookService(payload: Buffer, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event: Stripe.Event;

    try {
      event = this.ordersRepository.constructStripeEvent(
        payload,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Procesar el evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const subscriptionId = paymentIntent.metadata.subscriptionId;

        const subscription =
          await this.subscriptionsRepository.getSubscriptionByUserIdRepository(
            subscriptionId,
          );

        if (!subscription) {
          throw new NotFoundException(
            'Suscripción no encontrada para actualizar.',
          );
        }

        //Modularizar esta lógica en suscriptions
        // Obtener la fecha actual
        const now = new Date();

        // Calcular la nueva fecha de expiración
        let newExpirationDate: Date;

        if (subscription.expirationDate && subscription.expirationDate > now) {
          // Si la suscripción aún no ha expirado, extender un mes desde expirationDate actual
          newExpirationDate = new Date(subscription.expirationDate);
          newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
        } else {
          // Si ya expiró o no existe expirationDate, contar un mes desde hoy
          newExpirationDate = new Date();
          newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
        }

        // Actualizar la suscripción
        subscription.subscriptionType = SubscriptionsType.PREMIUM;
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.paymentDate = now;
        subscription.expirationDate = newExpirationDate;

        // Si nunca antes fue Premium, marcar la fecha
        if (!subscription.createdPremiumAt) {
          subscription.createdPremiumAt = now;
        }

        const OrderData = {
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
          status: OrderStatus.SUCCEEDED,
          subscription,
        };

        await this.ordersRepository.handlePaymentSucceeded(OrderData);

        await this.subscriptionsRepository.saveSubscriptionRepository(
          subscription,
        );

        break;
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        this.ordersRepository.handlePaymentFailed(failedIntent);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  // OBTENER ORDEN POR ID
  async getOrderByIdService(id: string) {
    const order: Order = await this.ordersRepository.getOrderByIdRepository(id);

    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no fue encontrada`);
    }
    return order;
  }
}
