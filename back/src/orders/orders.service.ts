import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreatePaymentDto } from 'src/DTO/ordersDtos/createPayment.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createPaymentIntentService(suscriptionData: CreatePaymentDto) {
    return await this.ordersRepository.createPaymentIntentRepository(
      suscriptionData,
    );
  }
}
