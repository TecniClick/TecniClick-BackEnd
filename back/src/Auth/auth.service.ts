import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/DTO/CreateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signInService(email: string, password: string) {
    const user = await this.usersRepository.getUserByEmailRepository(email);
    const matchPassword = bcrypt.compare(password, user.password);
    if (!matchPassword || !user)
      throw new BadRequestException('Las credenciales no son validas');
    const userPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(userPayload);
    return {
      token,
      message: 'User logged in successfully',
    };
  }

  async signUpService(user: CreateUserDto) {
    const userExists = await this.usersRepository.getUserByEmailRepository(
      user.email,
    );
    if (userExists) throw new BadRequestException('Información incorrecta');
    if (user.password !== user.confirmPassword)
      throw new BadRequestException('Información incorrecta');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('La contraseña no se pudo hashear');
    await this.usersRepository.createUserRepository({
      ...user,
      password: hashedPassword,
    });
    const { password, confirmPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
