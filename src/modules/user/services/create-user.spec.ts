import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import { CreateUser } from './create-user';

describe('CreateUser', () => {
  let provider: CreateUser;

  const prismaMockup = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  const userInterface = {
    id: '12345-f56789-ba',
    email: 'emailteste@gmail.com',
    name: 'gustavo rocha',
    password: 'senha1234',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUser,
        { provide: PrismaService, useValue: prismaMockup },
      ],
    }).compile();

    provider = module.get<CreateUser>(CreateUser);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('when we create a user', () => {
    describe('with valid fields', () => {
      let user: User;
      beforeEach(async () => {
        user = {
          ...userInterface,
        };
        prismaMockup.user.findFirst.mockReturnValue(undefined);
        prismaMockup.user.create.mockReturnValue(Promise.resolve(user));
      });
      it('should be able a create user', async () => {
        const userRequest: ICreateUserDTO = {
          email: 'emailteste@gmail.com',
          name: 'gustavo rocha',
          password: 'senha1234',
        };
        const request = await provider.execute(userRequest);

        expect(request).toEqual(userInterface);
        expect(prismaMockup.user.findFirst).toBeCalledTimes(1);
        expect(prismaMockup.user.create).toBeCalledTimes(1);
      });
    });
  });

  describe('when we create a user', () => {
    describe('with no valid fields', () => {
      let user: User;
      beforeEach(async () => {
        user = {
          ...userInterface,
        };
        prismaMockup.user.findFirst.mockReturnValue(Promise.resolve(user));
        prismaMockup.user.create.mockRejectedValue(Promise.resolve(user));
      });
      it('should not be able a create user', async () => {
        const userRequestFail: ICreateUserDTO = {
          email: 'emailteste@gmail.com',
          name: 'gustavo rocha',
          password: 'senha1234',
        };

        await expect(provider.execute(userRequestFail)).rejects.toEqual(
          new ConflictException('Usuário com endereço de e-mail já cadastrado'),
        );
        expect(prismaMockup.user.findFirst).toBeCalledTimes(1);
        expect(prismaMockup.user.create).toBeCalledTimes(0);
      });
    });
  });
});
