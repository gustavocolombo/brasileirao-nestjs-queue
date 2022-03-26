import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import ICreateUserDTO from 'src/modules/user/dtos/ICreateUserDTO';

@Injectable()
export default class SendMailProducerService {
  constructor(@InjectQueue('sendEmail-queue') private queue: Queue) {}

  async execute(createUser: ICreateUserDTO) {
    await this.queue.add('sendEmail-job', createUser);
  }
}
