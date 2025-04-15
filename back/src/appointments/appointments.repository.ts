import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentToSaveDto } from 'src/DTO/apptDtos/appointmentToCreate.dto';
import { CreateAppointmentDto } from 'src/DTO/apptDtos/CreateAppointment.dto';
import { Appointment } from 'src/entities/appointment.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { User } from 'src/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  // CREAR UNA CITA
  createAppointmentRepository(
    appointmentToCreate: AppointmentToSaveDto,
  ): Appointment {
    return this.appointmentsRepository.create(appointmentToCreate);
  }

  // GUARDAR UNA CITA
  async saveAppointmentRepository(
    appointment: Appointment,
  ): Promise<Appointment> {
    return await this.appointmentsRepository.save(appointment);
  }

  // OBTENER TODAS LAS CITAS
  async getAllAppointmentsRepository(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find();
  }

  // OBTENER UNA CITA BY ID
  async getAppointmentByIdRepository(id: string): Promise<Appointment> {
    return await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['users', 'provider', 'review'],
    });
  }

  // ELIMINAR UNA CITA EN LA BASE DE DATOS
  async deleteAppointmentRepository(id: string): Promise<DeleteResult> {
    return await this.appointmentsRepository.delete({ id });
  }
}
