import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
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
    console.log('Se comenzó a ejecutar el servicio de webhook');

    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!endpointSecret) {
      console.error(
        'Stripe Webhook Secret no definido en variables de entorno.',
      );
      throw new InternalServerErrorException('Stripe Webhook Secret missing.');
    }

    let event: Stripe.Event;

    try {
      event = this.ordersRepository.constructStripeEvent(
        payload,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.error('Error validando el webhook de Stripe:', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const subscriptionId = paymentIntent.metadata.subscriptionId;

        if (!subscriptionId) {
          console.error('No viene subscriptionId en metadata');
          return { received: true }; // Respondemos igual para que Stripe no repita
        }

        const subscription =
          await this.subscriptionsRepository.getSubscriptionByIdRepository(
            subscriptionId,
          );

        if (!subscription) {
          console.error('No se encontró la suscripción');
          return { received: true };
        }

        const now = new Date();
        let newExpirationDate =
          subscription.expirationDate && subscription.expirationDate > now
            ? new Date(subscription.expirationDate)
            : now;

        newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);

        subscription.subscriptionType = SubscriptionsType.PREMIUM;
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.paymentDate = now;
        subscription.expirationDate = newExpirationDate;

        if (!subscription.createdPremiumAt) {
          subscription.createdPremiumAt = now;
        }

        const orderData = {
          amount: paymentIntent.amount,
          paymentIntentId: paymentIntent.id,
          status: OrderStatus.SUCCEEDED,
          subscription,
        };

        const order =
          await this.ordersRepository.handlePaymentSucceeded(orderData);
        if (!order) {
          console.log('No se pudo crear la órden');
        }

        const newSubscription =
          await this.subscriptionsRepository.saveSubscriptionRepository(
            subscription,
          );
        if (!newSubscription) {
          console.log('No se pudo guardar la nueva suscripción');
        }

        console.log('Suscripción actualizada a PREMIUM correctamente.');
      } else if (event.type === 'payment_intent.payment_failed') {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        this.ordersRepository.handlePaymentFailed(failedIntent);
        console.warn('Pago fallido manejado.');
      } else {
        console.log(`Evento no manejado: ${event.type}`);
      }
    } catch (error) {
      console.error('Error procesando el evento:', error.message);
      // Siempre respondemos para que Stripe no lo intente reintentar
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
