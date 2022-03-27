import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import SendMailProducerService from 'src/jobs/sendMail-producer.service';
import { AuthenticateUser } from '../../services/authenticate-user';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import { CreateUser } from '../../services/create-user';
import IAuthUserDTO from '../../dtos/IAuthUserDTO';
import { ResetPassword } from '../../services/reset-password';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUser,
    private sendMailService: SendMailProducerService,
    private authenticateService: AuthenticateUser,
    private resetPasswordService: ResetPassword,
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

  @Put('/reset-pass/:email')
  async resetPass(@Body() new_password: string, @Param('email') email: string) {
    return await this.resetPasswordService.execute(
      email,
      JSON.stringify(new_password),
    );
  }
}
