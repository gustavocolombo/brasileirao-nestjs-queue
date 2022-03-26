import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import ICreateUserDTO from 'src/modules/user/dtos/ICreateUserDTO';

@Processor('sendEmail-queue')
export default class SendEmailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process('sendEmail-job')
  async sendEmailJob(job: Job<ICreateUserDTO>) {
    const { data } = job;

    const requestemail = await this.mailerService.sendMail({
      to: data.email,
      from: 'Equipe Maiself <no-reply@maiself.com.br>',
      subject: 'Seja bem vindo(a)!',
      text: `Bem vindo(a) agora você pode desfrutar ao máximo da organização pessoal`,
    });

    console.log('requestemail', requestemail);
  }
}
