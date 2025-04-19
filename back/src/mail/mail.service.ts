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
    // Ruta compatible con desarrollo y producción
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
}
