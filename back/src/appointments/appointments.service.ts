import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly serviceProfileRepository: ServiceProfileRepository,
  ) {}

  async createAppointmentService(createAppointment) {
    const user = await this.usersRepository.getUserByIdRepository(
      createAppointment.userId,
    );
    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    const provider =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(
        createAppointment.providerId,
      );
    if (!provider) throw new NotFoundException(`Proveedor no encontrado`);
    return this.appointmentsRepository.createAppointmentRepository(
      createAppointment,
      user,
      provider,
    );
  }

  async getAllAppointmentsService() {
    return this.appointmentsRepository.getAllAppointmentsRepository();
  }

  async getAppointmentByIdService(id: string) {
    return this.appointmentsRepository.getAppointmentByIdRepository(id);
  }

  updateAppointmentByIdService(id: string, updateAppointment) {
    return this.appointmentsRepository.updateAppointmentRepository(
      id,
      updateAppointment,
    );
  }

  deleteAppointmentService(id: string) {
    return this.appointmentsRepository.deleteAppointmentRepository(id);
  }
}
