import { Module } from '@nestjs/common';
import { CreateUser } from './services/create-user';
import { UserController } from './infra/http/user.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthenticateUser } from './services/authenticate-user';
import SendMailProducerService from 'src/jobs/sendMail-producer.service';
import SendEmailConsumer from 'src/jobs/sendMail-consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'sendEmail-queue',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [
    CreateUser,
    PrismaService,
    SendMailProducerService,
    SendEmailConsumer,
    AuthenticateUser,
  ],
  controllers: [UserController],
})
export class UserModule {}
