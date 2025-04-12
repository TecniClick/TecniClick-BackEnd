import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from 'src/DTO/apptDtos/CreateAppointment.dto';
import { UpdateAppointmentDto } from 'src/DTO/apptDtos/updateAppointment.dto';
import { RolesGuard } from 'src/Auth/guards/roles.guard';
import { AuthGuard } from 'src/Auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/UserRole.enum';

@ApiTags('Endpoints de appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('createAppointment')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  createAppointmentController(
    @Body() createAppointment: CreateAppointmentDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.appointmentsService.createAppointmentService({
      ...createAppointment,
      userId,
    });
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

  // CAMBIAR EL ESTADO A CONFIRMADO
  @Patch('confirm/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  confirmAppointmentController(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.confirmAppointmentService(id);
  }

  @Delete(':id')
  deleteAppointmentController(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointmentService(id);
  }
}
