import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentToSaveDto } from 'src/DTO/apptDtos/appointmentToCreate.dto';
import { Appointment } from 'src/entities/appointment.entity';
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
    return await this.appointmentsRepository.find({
      relations: ['users'],
    });
  }

  //OBTENER TODOS MIS APPTS
  async getMyAppointmentsRepository(userId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { users: { id: userId } },
      relations: ['users'],
      order: { date: 'ASC' },
    });
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
