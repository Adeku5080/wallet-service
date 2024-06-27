import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Request, Response } from 'express';
import { AuthController } from '../../src/controller/User';
import { RegisterDto } from '../../src/dto/register-dto';
import { UserService } from '../../src/services/user.service';
import { LoginDto } from '../../src/dto/login-dto';

chai.use(sinonChai);

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userService = {
      register: sinon.stub(),
      login: sinon.stub(),

      buildUserResponse: sinon.stub(),
    } as any;

    authController = new AuthController(userService);

    req = {
      body: {
        email: 'test@example.com',
        password: 'password',
        name: 'John Doe',
      },
    } as Partial<Request>;

    res = {
      status: sinon.stub().returnsThis(), 
      json: sinon.stub(),
    } as Partial<Response>;
  });

  afterEach(() => {
    sinon.reset();
  });

  describe('register', () => {
     it('should call register on UserService with the correct parameters', async () => {
       const body: RegisterDto = req.body as RegisterDto;
       const user = { id: 1, email: 'test@example.com' };
       const userResponse = { user: { ...user, token: 'some-jwt-token' } };

       (userService.register as sinon.SinonStub).resolves(user);
       (userService.buildUserResponse as sinon.SinonStub).returns(userResponse);

       await authController.register(body, res as Response);

       expect(userService.register).to.have.been.calledWith(body);
       expect(userService.buildUserResponse).to.have.been.calledWith(user);
       expect(res.status).to.have.been.calledWith(201);
       expect(res.json).to.have.been.calledWith(userResponse);
     });

     it('should handle errors and return 500 status', async () => {
       const body: RegisterDto = req.body as RegisterDto;
       const error = new Error('Something went wrong');

       (userService.register as sinon.SinonStub).rejects(error);

       try {
         await authController.register(body, res as Response);
       } catch (err) {
         expect(res.status).to.have.been.calledWith(500);
         expect(res.json).to.have.been.calledWith({ error: error.message });
       }
     });
  })

  describe('login', () => {
     it('should call login on UserService with the correct parameters', async () => {
       const body: LoginDto = req.body as LoginDto;
       const user = { id: 1, email: 'test@example.com' };
       const userResponse = { user: { ...user, token: 'some-jwt-token' } };

       (userService.login as sinon.SinonStub).resolves(user);
       (userService.buildUserResponse as sinon.SinonStub).returns(userResponse);

       await authController.login(body, res as Response);

       expect(userService.login).to.have.been.calledWith(body);
       expect(userService.buildUserResponse).to.have.been.calledWith(user);
       expect(res.status).to.have.been.calledWith(200);
       expect(res.json).to.have.been.calledWith(userResponse);
     });
    
    
  it('should handle errors and return 500 status', async () => {
    const body: LoginDto = req.body as LoginDto;
    const error = new Error('Something went wrong');

    (userService.login as sinon.SinonStub).rejects(error);

    try {
      await authController.login(body, res as Response);
    } catch (err) {
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({ error: error.message });
    }
  });
    
  })

 
});
