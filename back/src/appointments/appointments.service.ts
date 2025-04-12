import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { AppointmentStatus } from 'src/enums/AppointmentStatus.enum';
import { Appointment } from 'src/entities/appointment.entity';

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

  async updateAppointmentByIdService(id: string, updateAppointment) {
    const appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);
    if (!appointment)
      throw new NotFoundException(`Appointment con Id ${id} no fue encontrado`);
    const updated = Object.assign(appointment, updateAppointment);
    return this.appointmentsRepository.updateAppointmentRepository(appointment);
  }

  // CAMBIAR A CONFIRMADO
  async confirmAppointmentService(id: string): Promise<Appointment> {
    const appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);

    if (!appointment) {
      throw new NotFoundException(`La cita con ID ${id} no fue encontrada`);
    }

    if (appointment.appointmentStatus !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        `Solo se pueden confirmar citas que estén en estado "pending"`,
      );
    }

    appointment.appointmentStatus = AppointmentStatus.CONFIRMED;
    return this.appointmentsRepository.updateAppointmentRepository(appointment);
  }

  deleteAppointmentService(id: string) {
    return this.appointmentsRepository.deleteAppointmentRepository(id);
  }
}
