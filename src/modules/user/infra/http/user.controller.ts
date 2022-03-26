import { Body, Controller, Post } from '@nestjs/common';
import SendMailProducerService from 'src/jobs/sendMail-producer.service';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import { CreateUser } from '../../services/create-user';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUser,
    private sendMailService: SendMailProducerService,
  ) {}

  @Post('/create')
  async createUser(@Body() createUser: ICreateUserDTO) {
    const response = await this.createUserService.execute(createUser);
    await this.sendMailService.execute(createUser);

    return response;
  }
}
