import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import { Order } from 'src/entities/orders.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/enums/orderStatus.enum';

@Injectable()
export class OrdersRepository {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-03-31.basil',
    });
  }

  async createPaymentIntentRepository(
    subscriptionData: CreatePaymentDto,
    currency: string = 'usd',
  ) {
    return await this.stripe.paymentIntents.create({
      amount: subscriptionData.amount,
      currency,
      payment_method_types: ['card'],
      payment_method: subscriptionData.id,
      // confirm: true,
    });
  }

  constructStripeEvent(
    payload: Buffer,
    signature: string,
    endpointSecret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret,
    );
  }

  async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const amount = paymentIntent.amount;
    const paymentIntentId = paymentIntent.id;

    await this.ordersRepository.save({
      amount: amount,
      paymentIntentId: paymentIntentId,
      status: OrderStatus.SUCCEEDED,
      // otras propiedades que quieras: se debe crear el invoice y pasar suscripción.
    });

    // 2. Actualizar la Subscription de este usuario a tipo "premium"
    // await this.subscriptionRepository.upgradeToPremium(userId);
  }

  async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const paymentIntentId = paymentIntent.id;

    // ⚡ Opcional:
    // Puedes guardar un registro de que el intento de pago falló,
    // o enviarle una notificación al usuario si quieres.

    console.warn(`PaymentIntent ${paymentIntentId} failed.`);
  }
}
