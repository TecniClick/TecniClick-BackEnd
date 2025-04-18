import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/DTO/authDtos/CreateUser.dto';
import { User } from 'src/entities/user.entity';
import { SignUpResponseDto } from 'src/DTO/authDtos/signUp.dto';
import { IJwtPayload } from 'src/interfaces/jwtPlayload.interface';
import { SignInResponseDto } from 'src/DTO/authDtos/signIn.dto';
import { UserRole } from 'src/enums/UserRole.enum';

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

    if (!user) throw new BadRequestException('Las credenciales no son válidas');

    if (user.deletedAt !== null)
      throw new BadRequestException('Ese usuario fue eliminado anteriormente');

    const matchPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!matchPassword)
      throw new BadRequestException('Las credenciales no son válidas');

    const userPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token: string = this.jwtService.sign(userPayload);
    return {
      token,
      message: 'Usuario logeado con éxito.',
      userId: user.id,
    };
  }

  async signUpService(user: CreateUserDto): Promise<SignUpResponseDto> {
    const userExists: User =
      await this.usersRepository.getUserByEmailRepository(user.email);
    if (userExists)
      throw new ConflictException(
        'El correo electrónico ya se encuentra registrado',
      );
    if (user.password !== user.confirmPassword)
      throw new BadRequestException(
        'La contraseña y su confirmación no coinciden',
      );
    const hashedPassword: string = await bcrypt.hash(user.password, 10);

    if (!hashedPassword)
      throw new BadRequestException('La contraseña no se pudo hashear');
    const createdUser: User = await this.usersRepository.saveAUserRepository({
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

  async validateOAuthLogin(user: User): Promise<{
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      imgUrl: string;
      role: UserRole;
      hasServiceProfile: boolean;
    };
  }> {
    // Verificar si tiene ServiceProfile (con tu relación existente)
    const fullUser = await this.usersRepository.getUserByIdRepository(user.id);
    const hasServiceProfile = !!fullUser?.serviceProfile;

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      hasServiceProfile,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imgUrl: user.imgUrl,
        role: user.role,
        hasServiceProfile,
      },
    };
  }
}
