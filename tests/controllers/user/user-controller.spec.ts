import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { UserController } from '../../../src/controller/user.controller';
import { UserService } from '../../../src/services/user.service';
import { Response } from 'express';
import { RegisterDto } from '../../../src/dto/register-dto';
import { LoginDto } from '../../../src/dto/login-dto';

describe('UserController', () => {
  let userServiceStub: sinon.SinonStubbedInstance<UserService>;
  let userController: UserController;
  let resMock: sinon.SinonStubbedInstance<Response>;

  beforeEach(() => {
    userServiceStub = sinon.createStubInstance(UserService);
    userController = new UserController(userServiceStub);
    resMock = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<Response>;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should register a user and return success response', async () => {
      // Arrange
      const registerData: RegisterDto = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        country: '',
        state: '',
        street:''
      };

      const responseData = {
        user: {
          id: 74,
          name: 'adeku ali',
          email: 'aliadeku.aam@gmail.com',
          password:
            '$2a$10$4Wj4jgnBkJu139cAbGSJreRfdyFHTR/ODi1Ivj5er/k33wOtXDbt.',
          created_at: '2024-11-23T22:17:26.000Z',
          updated_at: '2024-11-23T22:17:26.000Z',
          country: 'Nigeria',
          state: 'Lagos',
          street: 'Araba street',
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzQsImVtYWlsIjoiYWxpYWRla3UuYWFtQGdtYWlsLmNvbSIsImlhdCI6MTczMjQwMDI0NiwiZXhwIjoxNzMyNDAzODQ2fQ.2eOkmMHSiZEo1WLdys6VikOv6dXsngabNRPds5Zp9Jo',
      };
      userServiceStub.register.resolves(responseData);

      // Act
      await userController.register(registerData, resMock);

      // Assert
      expect(resMock.status.calledOnceWith(201)).to.be.true;
      expect(
        resMock.json.calledOnceWith({
          status: 'success',
          message: 'User registered successfully',
          data: responseData,
        }),
      ).to.be.true;
    });
  });

  describe('login', () => {
    it('should login the user and return success response', async () => {
      const loginData: LoginDto = {
        email: 'test@example.com',
        password:'password123',
      }

         const responseData = {
           user: {
             id: 74,
             name: 'adeku ali',
             email: 'aliadeku.aam@gmail.com',
             password:
               '$2a$10$4Wj4jgnBkJu139cAbGSJreRfdyFHTR/ODi1Ivj5er/k33wOtXDbt.',
             created_at: '2024-11-23T22:17:26.000Z',
             updated_at: '2024-11-23T22:17:26.000Z',
             country: 'Nigeria',
             state: 'Lagos',
             street: 'Araba street',
           },
           token:
             'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzQsImVtYWlsIjoiYWxpYWRla3UuYWFtQGdtYWlsLmNvbSIsImlhdCI6MTczMjQwMDI0NiwiZXhwIjoxNzMyNDAzODQ2fQ.2eOkmMHSiZEo1WLdys6VikOv6dXsngabNRPds5Zp9Jo',
         };

      userServiceStub.login.resolves(responseData)

            await userController.login(loginData, resMock);


         expect(resMock.status.calledOnceWith(200)).to.be.true;
         expect(
           resMock.json.calledOnceWith({
             status: 'success',
             message: 'Login successful',
             data: responseData,
           }),
         ).to.be.true;
    })
  })
});
