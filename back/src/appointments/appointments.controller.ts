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
import { GetUser } from 'src/decorators/getUser.decorator';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { Appointment } from 'src/entities/appointment.entity';

@ApiTags('Endpoints de appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // CREAR UNA CITA
  @Post('createAppointment')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  createAppointmentController(
    @Body() createAppointment: CreateAppointmentDto,
    @GetUser() user: IJwtPayload,
  ): Promise<Appointment> {
    const userId: string = user.id;
    return this.appointmentsService.createAppointmentService(
      createAppointment,
      userId,
    );
  }

  // OBTENER TODAS LAS CITAS
  @Get()
  getAllAppointmentsController(): Promise<Appointment[]> {
    return this.appointmentsService.getAllAppointmentsService();
  }

  // OBTENER UNA CITA BY ID
  @Get(':id')
  getAppointmentByIdController(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.getAppointmentByIdService(id);
  }

  // MODIFICAR UNA CITA BY ID
  @Patch(':id')
  updateAppointmentController(
    @Param('id') id: string,
    @Body() updateAppointment: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.updateAppointmentByIdService(
      id,
      updateAppointment,
    );
  }

  // // CAMBIAR EL ESTADO A CONFIRMADO
  // @Patch('confirm/:id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.PROVIDER)
  // confirmAppointmentController(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.appointmentsService.confirmAppointmentService(id);
  // }

  // CAMBIAR EL ESTADO A COMPLETADO
  @Patch('complete/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  completeAppointmentController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Appointment> {
    return this.appointmentsService.completeAppointmentService(id);
  }

  // CAMBIAR EL ESTADO A CANCELADO
  @Patch('cancel/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  cancelAppointmentController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Appointment> {
    return this.appointmentsService.cancelAppointmentService(id);
  }

  // ELIMINAR UNA CITA EN LA BASE DE DATOS
  @Delete(':id')
  deleteAppointmentController(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.deleteAppointmentService(id);
  }
}
