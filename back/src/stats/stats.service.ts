import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ServiceProfile)
    private serviceProfileRepository: Repository<ServiceProfile>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getSummaryStats() {
    return {
      totalUsers: await this.userRepository.count(),
      activeUsers: await this.userRepository.count({
        where: { deletedAt: null },
      }),
      totalServices: await this.serviceProfileRepository.count(),
      pendingAppointments: await this.appointmentRepository.count(),
    };
  }

  async getServicesByCategory() {
    return this.serviceProfileRepository
      .createQueryBuilder('service')
      .select('category.name', 'category')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('service.category', 'category')
      .groupBy('category.name')
      .getRawMany();
  }
}
