import { Body, Controller, Post } from '@nestjs/common';
import SendMailProducerService from 'src/jobs/sendMail-producer.service';
import { AuthenticateUser } from '../../services/authenticate-user';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import { CreateUser } from '../../services/create-user';
import IAuthUserDTO from '../../dtos/IAuthUserDTO';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUser,
    private sendMailService: SendMailProducerService,
    private authenticateService: AuthenticateUser,
  ) {}

  @Post('/create')
  async createUser(@Body() createUser: ICreateUserDTO) {
    const response = await this.createUserService.execute(createUser);
    await this.sendMailService.execute(createUser);

    delete response.password;

    return response;
  }

  @Post('/authenticate')
  async createToken(@Body() authUser: IAuthUserDTO) {
    return await this.authenticateService.execute(authUser);
  }
}
