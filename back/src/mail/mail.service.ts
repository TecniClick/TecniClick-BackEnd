// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  //Envio de correo al crear usuario
  async sendWelcomeEmail(to: string, name: string) {
    const templatePath = path.join(
      process.cwd(), // Raíz del proyecto
      'src', // Entra a src/
      'mail',
      'templates',
      'welcome.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({ name });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to,
      subject: '¡Bienvenido a TecniClick!',
      html,
    });
  }

  //envio de correo al crear perfil de servicio
  async sendProviderPendingEmail(
    email: string,
    name: string,
    category: string,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'provider-pending.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      name,
      category,
      requestDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Tu solicitud de proveedor está en revisión',
      html,
    });
  }

  //Envio de correo al aprobarse perfil de servicio
  async sendProviderApprovedEmail(
    email: string,
    name: string,
    category: string,
  ) {
    const html = this.compileTemplate('provider-approved.hbs', {
      name,
      category,
      approvalDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: '¡Felicidades! Tu perfil de proveedor ha sido aprobado',
      html,
    });
  }

  //Envio de correo al rechazar la creacion de perfil de servicio
  async sendProviderRejectedEmail(
    email: string,
    name: string,
    category: string,
  ) {
    const html = this.compileTemplate('provider-rejected.hbs', {
      name,
      category,
      rejectionDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Resultado de tu solicitud de proveedor',
      html,
    });
  }

  private compileTemplate(templateName: string, context: object): string {
    const templatePath = path.join(__dirname, 'templates', templateName);
    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    return template(context);
  }

  //envio de correo al usuario al realizar un appointment
  async sendAppointmentConfirmation(
    userEmail: string,
    userName: string,
    providerName: string,
    providerService: string,
    appointmentDate: Date,
    additionalNotes?: string,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'appointment-confirmation.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      userName,
      providerName,
      providerService,
      appointmentDate: appointmentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      additionalNotes: additionalNotes || 'Ninguna',
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: userEmail,
      subject: 'Confirmación de tu cita',
      html,
    });
  }

  // CREACION DE APPT NOTIFICACION PROVEEDOR DE SERVICIO
  async sendAppointmentNotificationToProvider(
    providerEmail: string,
    providerName: string,
    userName: string,
    userPhone: string,
    serviceTitle: string,
    appointmentDate: Date,
    additionalNotes?: string,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'appointment-provider-notification.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      providerName,
      userName,
      userPhone,
      serviceTitle,
      appointmentDate: appointmentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      additionalNotes: additionalNotes || 'Ninguna',
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: providerEmail,
      subject: 'Nueva cita agendada',
      html,
    });
  }

  //ENVIO DE CORREO AL DESACTIVACION DE CUENTA LOGICAMENTE
  async sendAccountDeactivatedEmail(email: string, name: string) {
    const html = this.compileTemplate('account-deactivated.hbs', {
      name,
      deactivationDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick - Soporte" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Notificación importante: Tu cuenta ha sido desactivada',
      html,
    });
  }

  //EMAIL PARA ELIMINACION DE REVIEW
  async sendReviewDeletedEmail(
    email: string,
    userName: string,
    serviceTitle: string,
    rating: number,
    comment: string,
    createdAt: Date,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'review-deleted.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      userName,
      serviceTitle,
      rating,
      comment,
      createdAt: createdAt.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick - Soporte" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Notificación: Tu reseña ha sido eliminada',
      html,
    });
  }

  //ENVIO DE CORREO AL REGISTRARSE CON GOOGLE
  async sendGoogleWelcomeEmail(to: string, name: string) {
    const html = this.compileTemplate('google-welcome.hbs', {
      name,
      registrationDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to,
      subject: '¡Bienvenido a TecniClick (Registro con Google)',
      html,
    });
  }

  //CORREO PARA REACTIVAR USUARIO
  async sendAccountReactivatedEmail(email: string, name: string) {
    const html = this.compileTemplate('account-reactivated.hbs', {
      name,
      reactivationDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick - Soporte" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Tu cuenta ha sido reactivada',
      html,
    });
  }

  //CORREO PARA NOTIFICAR PAGO EXITOSO
  async sendPaymentSuccessEmail(
    email: string,
    name: string,
    paymentDate: Date,
    expirationDate: Date,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'payment-success.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      name,
      paymentDate: paymentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      expirationDate: expirationDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Pago exitoso - Suscripción Premium',
      html,
    });
  }

  //ENVIO DE CORREO AL CREAR REVIEW
  async sendReviewSubmittedEmail(
    providerEmail: string,
    providerName: string,
    userName: string,
    serviceTitle: string,
    rating: number,
    comment: string,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'review-submitted.hbs',
    );

    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      providerName,
      userName,
      serviceTitle,
      rating,
      comment,
      reviewDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ratingStars: '★'.repeat(rating) + '☆'.repeat(5 - rating), // Ejemplo: ★★★★☆
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: providerEmail,
      subject: `Nueva reseña recibida para ${serviceTitle}`,
      html,
    });
  }
}
