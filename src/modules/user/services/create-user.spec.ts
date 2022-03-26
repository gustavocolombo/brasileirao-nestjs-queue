import { Test, TestingModule } from '@nestjs/testing';
import { CreateUser } from './create-user';

describe('CreateUser', () => {
  let provider: CreateUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUser],
    }).compile();

    provider = module.get<CreateUser>(CreateUser);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
