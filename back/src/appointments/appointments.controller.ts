import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from 'src/DTO/apptDtos/CreateAppointment.dto';
import { UpdateAppointmentDto } from 'src/DTO/apptDtos/updateAppointment.dto';

@ApiTags('Endpoints de appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('createAppointment')
  createAppointmentController(@Body() createAppointment: CreateAppointmentDto) {
    return this.appointmentsService.createAppointmentService(createAppointment);
  }

  @Get()
  getAllAppointmentsController() {
    return this.appointmentsService.getAllAppointmentsService();
  }

  @Get(':id')
  getAppointmentByIdController(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentByIdService(id);
  }

  @Patch(':id')
  updateAppointmentController(@Param('id') id: string, @Body() updateAppointment: UpdateAppointmentDto) {
    return this.appointmentsService.updateAppointmentByIdService(id, updateAppointment);
  }

  @Delete(':id')
  deleteAppointmentController(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointmentService(id);
  }
}
