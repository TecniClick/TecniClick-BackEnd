import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { AppointmentStatus } from 'src/enums/AppointmentStatus.enum';
import { Appointment } from 'src/entities/appointment.entity';
import { CreateAppointmentDto } from 'src/DTO/apptDtos/CreateAppointment.dto';
import { User } from 'src/entities/user.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { AppointmentToSaveDto } from 'src/DTO/apptDtos/appointmentToCreate.dto';
import { UpdateAppointmentDto } from 'src/DTO/apptDtos/updateAppointment.dto';
import { DeleteResult } from 'typeorm';
import { ServiceProfileStatus } from 'src/enums/serviceProfileStatus.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly serviceProfileRepository: ServiceProfileRepository,
    private readonly mailService: MailService,
  ) {}

  // CREAR UNA CITA
  async createAppointmentService(
    createAppointment: CreateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    const user: User = await this.usersRepository.getUserByIdRepository(userId);
    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    const provider: ServiceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(
        createAppointment.providerId,
      );
    if (!provider) throw new NotFoundException(`Proveedor no encontrado`);

    if (provider.status === ServiceProfileStatus.PENDING)
      throw new BadRequestException(
        `No se puede crear una cita con un perfil de servicio no activado`,
      );

    const appointmentToCreate: AppointmentToSaveDto = {
      date: new Date(createAppointment.date),
      additionalNotes: createAppointment.additionalNotes,
      users: user,
      provider: provider,
    };

    if (user.id === provider.user.id)
      throw new BadRequestException(
        `No se puede crear una cita con el perfil de servicio del mismo usuario`,
      );

    const savedAppointment: Appointment =
      await this.appointmentsRepository.createAppointmentRepository(
        appointmentToCreate,
      );

    try {
      // Enviar correo al cliente (solo si tiene email)
      if (user.email) {
        await this.mailService.sendAppointmentConfirmation(
          user.email,
          user.name,
          provider.userName,
          provider.serviceTitle,
          appointmentToCreate.date,
          createAppointment.additionalNotes,
        );
      }

      // Enviar correo al proveedor (solo si tiene email)
      if (provider.user?.email) {
        await this.mailService.sendAppointmentNotificationToProvider(
          provider.user.email,
          provider.userName,
          user.name,
          user.phone.toString(),
          provider.serviceTitle,
          appointmentToCreate.date,
          createAppointment.additionalNotes,
        );
      }
    } catch (error) {
      console.error('Error al enviar correos:', error);
      throw new InternalServerErrorException(
        'Error al enviar notificaciones por correo',
      );
    }

    return await this.appointmentsRepository.saveAppointmentRepository(
      savedAppointment,
    );
  }

  // OBTENER TODAS LAS CITAS
  async getAllAppointmentsService(): Promise<Appointment[]> {
    return this.appointmentsRepository.getAllAppointmentsRepository();
  }

  //OBTENER TODOS MIS APPOINTMENTS COMO USER
  async getMyAppointments(userId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.getMyAppointmentsRepository(userId);
  }

  //OBTENER TODOS MIS APPOINTMENTS COMO PROVIDER
  async getMyProviderAppointmentsService(userId: string): Promise<Appointment[]>{
    return this.appointmentsRepository.getAppointmentsByProviderId(userId)
  }

  // OBTENER UNA CITA BY ID
  async getAppointmentByIdService(id: string): Promise<Appointment> {
    const foundAppointment: Appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);

    if (!foundAppointment)
      throw new NotFoundException(`No se pudo encontrar la cita con Id ${id}`);

    return foundAppointment;
  }

  // MODIFICAR UNA CITA BY ID
  async updateAppointmentByIdService(
    id: string,
    updateAppointment: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment: Appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);
    if (!appointment)
      throw new NotFoundException(`La cita con Id ${id} no fue encontrada`);

    if (updateAppointment.date)
      appointment.date = new Date(updateAppointment.date);
    if (updateAppointment.additionalNotes)
      appointment.additionalNotes = updateAppointment.additionalNotes;

    return await this.appointmentsRepository.saveAppointmentRepository(
      appointment,
    );
  }

  // // CAMBIAR A CONFIRMADO
  // async confirmAppointmentService(id: string): Promise<Appointment> {
  //   const appointment =
  //     await this.appointmentsRepository.getAppointmentByIdRepository(id);

  //   if (!appointment) {
  //     throw new NotFoundException(`La cita con ID ${id} no fue encontrada`);
  //   }

  //   if (appointment.appointmentStatus !== AppointmentStatus.PENDING) {
  //     throw new BadRequestException(
  //       `Solo se pueden confirmar citas que estén en estado "pending"`,
  //     );
  //   }

  // CAMBIAR A COMPLETADO
  async completeAppointmentService(id: string): Promise<Appointment> {
    const appointment: Appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);

    if (!appointment) {
      throw new NotFoundException(`La cita con ID ${id} no fue encontrada`);
    }

    if (appointment.appointmentStatus !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException(
        `Solo se pueden declarar completadas citas que estén en estado "confirmed"`,
      );
    }

    appointment.appointmentStatus = AppointmentStatus.COMPLETED;
    return this.appointmentsRepository.saveAppointmentRepository(appointment);
  }

  // CAMBIAR A CANCELADO
  async cancelAppointmentService(id: string): Promise<Appointment> {
    const appointment: Appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);

    if (!appointment) {
      throw new NotFoundException(`La cita con ID ${id} no fue encontrada`);
    }

    if (appointment.appointmentStatus !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException(
        `Solo se pueden cancelar citas que estén en estado "confirmed"`,
      );
    }

    appointment.appointmentStatus = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.saveAppointmentRepository(appointment);
  }

  // ELIMINAR UNA CITA EN LA BASE DE DATOS
  async deleteAppointmentService(id: string): Promise<Appointment> {
    const foundAppointment: Appointment =
      await this.appointmentsRepository.getAppointmentByIdRepository(id);
    if (!foundAppointment)
      throw new NotFoundException(`Appointmend con Id ${id} no fue encontrado`);
    const result: DeleteResult =
      await this.appointmentsRepository.deleteAppointmentRepository(id);
    if (result.affected === 0) {
      throw new NotFoundException('La cita no pudo ser eliminada.');
    }
    return foundAppointment;
  }
}
