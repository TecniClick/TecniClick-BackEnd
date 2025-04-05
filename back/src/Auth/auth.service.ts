import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/DTO/userDtos/CreateUser.dto';
import { User } from 'src/entities/user.entity';
import { SignUpResponseDto } from 'src/DTO/authDtos/signUp.dto';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { SignInResponseDto } from 'src/DTO/authDtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signInService(
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const user: User =
      await this.usersRepository.getUserByEmailRepository(email);
    const matchPassword: string = bcrypt.compare(password, user.password);
    if (!matchPassword || !user)
      throw new BadRequestException('Las credenciales no son validas');
    const userPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token: string = this.jwtService.sign(userPayload);
    return {
      token,
      message: 'Usuario logeado con éxito.',
    };
  }

  async signUpService(user: CreateUserDto): Promise<SignUpResponseDto> {
    const userExists: User =
      await this.usersRepository.getUserByEmailRepository(user.email);
    if (userExists)
      throw new BadRequestException(
        'El correo electrónico ya se encuentra registrado',
      );
    if (user.password !== user.confirmPassword)
      throw new BadRequestException(
        'La contraseña y su confirmación no coinciden',
      );
    const hashedPassword: string = await bcrypt.hash(user.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('La contraseña no se pudo hashear');
    const createdUser: User = await this.usersRepository.createUserRepository({
      ...user,
      password: hashedPassword,
    });

    //Generamos el token para mejorar la experiencia de usuario:

    const payload: IJwtPayload = {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };

    const token: string = this.jwtService.sign(payload);

    return {
      message: 'Usuario registrado con éxito.',
      createdUser,
      token,
    };
  }
}
