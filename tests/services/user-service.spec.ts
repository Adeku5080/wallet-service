import sinon, { SinonStub } from 'sinon';
import { Request, Response } from 'express';
import { AuthController } from '../../src/controller/User';
import { UserService } from '../../src/services/user.service';
import { RegisterDto } from '../../src/dto/register-dto';
import { LoginDto } from '../../src/dto/login-dto';
import { UserRepository } from '../../src/repository/user.repository';
import { compare } from 'bcryptjs';

describe('UserService', () => {
  let mockUserService: UserService;
  let authController: AuthController;
  let mockUserRepository: sinon.SinonStubbedInstance<UserRepository>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let bcryptCompareStub: SinonStub;

  beforeEach(() => {
    mockUserService = {
      register: sinon.stub(),
      login: sinon.stub(),
      buildUserResponse: sinon.stub(),
    } as any;

    authController = new AuthController(mockUserService);

    req = {
      body: {
        email: 'test@example.com',
        password: 'password',
        name: 'john doe',
      },
    } as Partial<Request>;

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as Partial<Response>;

    mockUserRepository = sinon.createStubInstance(UserRepository);
    // bcryptCompareStub = sinon.stub(compare);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const body = req.body as RegisterDto;
      const user = { id: 1, email: 'test@example.com' };
      const userResponse = { user: { ...user, token: 'some-jwt-token' } };

      (mockUserService.register as SinonStub).resolves(user);
      (mockUserService.buildUserResponse as SinonStub).returns(userResponse);

      await authController.register(body, res as Response);

      sinon.assert.calledWith(res.status as SinonStub, 201);
      sinon.assert.calledWith(res.json as SinonStub, userResponse);
    });

    it('should handle registration failure when a user with that email already exists', async () => {
      const body = req.body as RegisterDto;
      const errorMessage = 'Email already exists';

      (mockUserRepository.findBy as SinonStub)
        .withArgs({ email: body.email })
        .resolves({ id: 1, email: body.email });

      try {
        await authController.register(body, res as Response);
      } catch (err) {
        sinon.assert.calledWith(res.status as SinonStub, 400);
        sinon.assert.calledWith(res.json as SinonStub, {
          message: errorMessage,
        });
      }
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const body = req.body as LoginDto;
      const user = { id: 1, email: 'test@example.com' };
      const userResponse = { user: { ...user, token: 'some-jwt-token' } };

      (mockUserService.login as SinonStub).resolves(user);
      (mockUserService.buildUserResponse as SinonStub).returns(userResponse);

      await authController.login(body, res as Response);

      sinon.assert.calledWith(res.status as SinonStub, 200);
      sinon.assert.calledWith(res.json as SinonStub, userResponse);
    });

    it('should handle login failure when a user with this email does not exist', async () => {
      const body = {
        email: 'aladeku@gmail.com',
        password: '123456',
      } as LoginDto;
      const errorMessage = 'user with this credential does not exist';

      (mockUserRepository.findBy as SinonStub)
        .withArgs({ email: body.email })
        .resolves({ id: 1, email: body.email });

      await authController.login(body, res as Response);

      try {
        await authController.login(body, res as Response);
      } catch (err) {
        sinon.assert.calledWith(res.status as SinonStub, 400);
        sinon.assert.calledWith(res.json as SinonStub, {
          message: errorMessage,
        });
      }
    });

    it('should handle login failure when the password is incorrect', async () => {
      const body = {
        email: 'aladeku@gmail.com',
        password: '123456',
      } as LoginDto;
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      const errorMessage = 'email or password is incorrect';

      bcryptCompareStub.withArgs(body.password, user.password).resolves(false);
      await authController.login(body, res as Response);

      try {
        await authController.login(body, res as Response);
      } catch (err) {
        sinon.assert.calledWith(res.status as SinonStub, 400);
        sinon.assert.calledWith(res.json as SinonStub, {
          message: errorMessage,
        });
      }
    });
  });
});
