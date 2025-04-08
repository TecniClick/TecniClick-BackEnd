import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from 'src/DTO/apptDtos/CreateAppointment.dto';
import { UpdateAppointmentDto } from 'src/DTO/apptDtos/updateAppointment.dto';
import { RolesGuard } from 'src/Auth/guards/roles.guard';

@ApiTags('Endpoints de appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('createAppointment')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
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
  updateAppointmentController(
    @Param('id') id: string,
    @Body() updateAppointment: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointmentByIdService(
      id,
      updateAppointment,
    );
  }

  @Delete(':id')
  deleteAppointmentController(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointmentService(id);
  }
}
