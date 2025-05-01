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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Cita creada exitosamente',
    type: Appointment,
  })
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
  @ApiOperation({ summary: 'Obtener todas las citas existentes' })
  @ApiResponse({ status: 200, type: [Appointment] })
  getAllAppointmentsController(): Promise<Appointment[]> {
    return this.appointmentsService.getAllAppointmentsService();
  }

  //OBTENER APPTS DEL USUARIO CON INICIO DE SESION
  @Get('myAppointments')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener citas del usuario autenticado' })
  @ApiResponse({ status: 200, type: [Appointment] })
  getMyappointmentsController(@GetUser() user: IJwtPayload) {
    return this.appointmentsService.getMyAppointments(user.id);
  }

  // OBTENER CITAS DEL PROVEEDOR CON USERID
  @Get('providerappt')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener citas del proveedor autenticado' })
  @ApiResponse({ status: 200, type: [Appointment] })
  async getMyProviderAppointments(@GetUser() user: { id: string }) {
    return this.appointmentsService.getMyProviderAppointmentsService(user.id);
  }

  // OBTENER UNA CITA BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener cita por ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita', type: 'string' })
  @ApiResponse({ status: 200, type: Appointment })
  getAppointmentByIdController(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.getAppointmentByIdService(id);
  }

  // MODIFICAR UNA CITA BY ID
  @Patch(':id')
  @ApiOperation({ summary: 'Modificar una cita existente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita a modificar',
    type: 'string',
  })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, type: Appointment })
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Completar una cita confirmada' })
  @ApiParam({ name: 'id', description: 'ID de la cita', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cita marcada como completada',
    type: Appointment,
  })
  completeAppointmentController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Appointment> {
    return this.appointmentsService.completeAppointmentService(id);
  }

  // CAMBIAR EL ESTADO A CANCELADO
  @Patch('cancel/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cancelar una cita confirmada' })
  @ApiParam({ name: 'id', description: 'ID de la cita', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Cita cancelada exitosamente',
    type: Appointment,
  })
  cancelAppointmentController(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Appointment> {
    return this.appointmentsService.cancelAppointmentService(id);
  }

  // ELIMINAR UNA CITA EN LA BASE DE DATOS
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cita por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita a eliminar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Cita eliminada exitosamente',
    type: Appointment,
  })
  deleteAppointmentController(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.deleteAppointmentService(id);
  }
}
