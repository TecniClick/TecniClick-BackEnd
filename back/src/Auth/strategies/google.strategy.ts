import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersRepository } from '../../users/users.repository';
import { UserRole } from 'src/enums/UserRole.enum';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersRepository: UsersRepository, private readonly mailService: MailService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        'https://tecniclick-backend.onrender.com/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const userData = {
      email: emails[0].value,
      name: name.givenName + (name.familyName ? ` ${name.familyName}` : ''),
      phone: 0, // Valor temporal, el usuario deberá actualizarlo
      address: 'Dirección no especificada', // Valor temporal
      password: '', // No necesaria para OAuth
      // imgUrl:
      //   photos?.[0]?.value ||
      //   'https://www.shutterstock.com/image-vector/default-avatar-profile-social-media-600nw-1920331226.jpg',
      role: UserRole.CUSTOMER, // Rol por defecto
    };

    try {
      let user = await this.usersRepository.getUserByEmailRepository(
        userData.email,
      );

      if (!user) {
        // Crear nuevo usuario
        user = await this.usersRepository.saveAUserRepository(userData);
        await this.mailService.sendGoogleWelcomeEmail(user.email, user.name);
      } else if (user.deletedAt) {
        // Reactivar usuario eliminado
        user.deletedAt = null;
        user = await this.usersRepository.updateUserRepository(user.id, user);
      } else {
        // Actualizar imagen si es necesario
        // if (!user.imgUrl && userData.imgUrl) {
        //   user.imgUrl = userData.imgUrl;
        //   user = await this.usersRepository.updateUserRepository(user.id, {
        //     imgUrl: user.imgUrl,
        //   });
        // }
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
