import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from 'src/DTO/apptDtos/CreateAppointment.dto';
import { Appointment } from 'src/entities/appointment.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async createAppointmentRepository(
    createAppointment: CreateAppointmentDto,
    user: User,
    provider: ServiceProfile,
  ): Promise<Appointment> {
    const newAppointment = this.appointmentsRepository.create({
      date: new Date(createAppointment.date),
      additionalNotes: createAppointment.additionalNotes,
      users: user,
      provider: provider,
    });
    return this.appointmentsRepository.save(newAppointment);
  }

  async getAllAppointmentsRepository() {
    const appointments = await this.appointmentsRepository.find();
    return appointments;
  }

  async getAppointmentByIdRepository(id: string) {
    const foundAppointment = await this.appointmentsRepository.findOne({
      where: { id: id },
    });
    if (!foundAppointment)
      throw new NotFoundException(
        `No se pudo encontrar el appointment con Id ${id}`,
      );
    return foundAppointment;
  }

  async updateAppointmentRepository(id, updateAppointment) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: id },
    });
    if (!appointment)
      throw new NotFoundException(`Appointment con Id ${id} no fue encontrado`);
    const updated = Object.assign(appointment, updateAppointment);
    return this.appointmentsRepository.save(updated);
  }

  async deleteAppointmentRepository(id: string) {
    const foundAppointment = await this.appointmentsRepository.findOne({
      where: { id: id },
    });
    if (!foundAppointment)
      throw new NotFoundException(`Appointmend con Id ${id} no fue encontrado`);
    return await this.appointmentsRepository.delete(foundAppointment);
  }
}
