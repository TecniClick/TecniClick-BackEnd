import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';
import { Order } from 'src/entities/orders.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from 'src/DTO/ordersDtos/createOrder.dto';

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

  // OBTENER TODAS LAS ÓRDENES EXISTENTES
  async getAllOrdersRepository(): Promise<Order[]> {
    return await this.ordersRepository.find();
  }

  //CREAR UNA ORDEN
  async createOrderRepository(order: CreateOrderDto): Promise<Order> {
    return await this.ordersRepository.save(order);
  }
  async createPaymentIntentRepository(
    subscriptionData: CreatePaymentDto,
    currency: string = 'usd',
    subscriptionId: string,
  ) {
    return await this.stripe.paymentIntents.create({
      amount: subscriptionData.amount,
      currency,
      payment_method_types: ['card'],
      payment_method: subscriptionData.id,
      metadata: {
        subscriptionId,
      },
      confirm: true,
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

  async handlePaymentSucceeded(orderData: Partial<Order>) {
    await this.ordersRepository.save(orderData);
  }

  handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const paymentIntentId = paymentIntent.id;
    console.warn(`PaymentIntent ${paymentIntentId} failed.`);
  }

  // OBTENER ORDEN POR ID
  async getOrderByIdRepository(id: string): Promise<Order> {
    return await this.ordersRepository.findOne({
      where: { id },
    });
  }
}
