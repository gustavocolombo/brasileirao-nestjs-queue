import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

@Injectable()
export class CreateUser {
  constructor(private prisma: PrismaService) {}

  async execute(createUser: ICreateUserDTO) {
    const user = await this.prisma.user.findFirst({
      where: { email: createUser.email },
    });

    if (user)
      throw new ConflictException(
        'Usuário com endereço de e-mail já cadastrado',
      );

    const hashedPass = await hash(createUser.password, 8);

    const newUser = await this.prisma.user.create({
      data: {
        email: createUser.email,
        name: createUser.name,
        password: hashedPass,
      },
    });

    return newUser;
  }
}
