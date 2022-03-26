import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateUser } from './authenticate-user';

describe('AuthenticateUser', () => {
  let provider: AuthenticateUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticateUser],
    }).compile();

    provider = module.get<AuthenticateUser>(AuthenticateUser);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
