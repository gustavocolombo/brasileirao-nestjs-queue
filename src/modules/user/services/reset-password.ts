import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class ResetPassword {
  constructor(
    @InjectTwilio() private readonly client: TwilioClient,
    private prismaService: PrismaService,
  ) {}

  async execute(email: string, new_password: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (!user) throw new NotFoundException('Email não encontrado');

    const newPass = await hash(new_password, 8);

    const updateUser = await this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPass,
      },
    });

    const message = await this.client.messages.create({
      body: 'Este é o código de recuperação de senha',
      from: process.env.TWILIO_NUMBER_PHONE,
      to: '+5585981180797',
    });

    console.log('message', message);

    return updateUser;
  }
}
