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
import { ResetPassword } from './services/reset-password';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
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
    ResetPassword,
  ],
  controllers: [UserController],
})
export class UserModule {}
