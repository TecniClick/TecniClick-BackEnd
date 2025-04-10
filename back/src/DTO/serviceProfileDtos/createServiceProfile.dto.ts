import { ApiProperty } from "@nestjs/swagger";

export class CreateServiceProfileDto {
  @ApiProperty({ example: 'Electricista Profesional', description: 'Título del servicio ofrecido' })
  serviceTitle: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario que ofrece el servicio' })
  userName: string;

  @ApiProperty({ example: 'Cra 45 #32-21, Medellín', description: 'Dirección del proveedor del servicio' })
  address: string;

  @ApiProperty({ example: 4.8, description: 'Calificación promedio del servicio', minimum: 0, maximum: 5 })
  rating: number;

  @ApiProperty({ example: 'Servicio de instalaciones eléctricas residenciales y comerciales.', description: 'Descripción del servicio' })
  description: string;

  @ApiProperty({ example: 150000, description: 'Precio por cita en dolares' })
  appointmentPrice: number;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono del proveedor del servicio' })
  phone: string;

  @ApiProperty({ example: 'Electricidad', description: 'Categoría del servicio' })
  category: string;
}
