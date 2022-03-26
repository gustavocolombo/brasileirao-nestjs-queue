import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import IAuthUserDTO from '../dtos/IAuthUserDTO';

@Injectable()
export class AuthenticateUser {
  constructor(private prismaService: PrismaService) {}

  async execute(authUser: IAuthUserDTO) {
    const user = await this.prismaService.user.findFirst({
      where: { email: authUser.email },
    });

    if (!user) throw new NotFoundException('Endereço de email não encontrado');

    const comparePass = await compare(authUser.password, user.password);

    if (!comparePass)
      throw new UnauthorizedException('Email/Senha não correspondem');

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      '1d214954ab285bdb194ca4938d94c382',
      {
        expiresIn: '1d',
        subject: user.id,
      },
    );

    return { token, user };
  }
}
