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

  async sendProviderPendingEmail(
    email: string,
    name: string,
    category: string
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'provider-pending.hbs'
    );
  
    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
    const html = template({
      name,
      category,
      requestDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
  
    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Tu solicitud de proveedor está en revisión',
      html,
    });
  }

  async sendProviderApprovedEmail(email: string, name: string, category: string) {
    const html = this.compileTemplate('provider-approved.hbs', {
      name,
      category,
      approvalDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });

    await this.transporter.sendMail({
      from: `"TecniClick" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: '¡Felicidades! Tu perfil de proveedor ha sido aprobado',
      html,
    });
  }

  async sendProviderRejectedEmail(email: string, name: string, category: string) {
    const html = this.compileTemplate('provider-rejected.hbs', {
      name,
      category,
      rejectionDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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
  
}
