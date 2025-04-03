import 'mocha';
import sinon from 'sinon';

import { expect } from 'chai';
import { UserService } from '../../../src/services/user.service';
import { UserRepository } from '../../../src/repository/user.repository';
import { JWT } from '../../../src/helpers/jwt';
import { RegisterDto } from '../../../src/dto/register-dto';


describe('UserService', () => {
  let userRepositoryStub: sinon.SinonStubbedInstance<UserRepository>;
  let userService: UserService;
  let jwt :sinon.SinonStubbedInstance<JWT>

  beforeEach(() => {
    userRepositoryStub = sinon.createStubInstance(UserRepository);
    jwt = sinon.createStubInstance(JWT)
    userService = new UserService(userRepositoryStub ,jwt);
  });

  afterEach(() => {
    sinon.restore();
  });

 describe('register', () => {
   it('should register the user', async () => {
     // Arrange
     const registerData: RegisterDto = {
       name: 'testuser',
       email: 'newuser@example.com', // Different email to allow registration
       password: 'password123',
       country: '',
       state: '',
       street: '',
     };

     const responseData = {
       user: {
         id: 74,
         name: 'adeku ali',
         email: 'newuser@example.com', // Match the registered email
         password:
           '$2a$10$4Wj4jgnBkJu139cAbGSJreRfdyFHTR/ODi1Ivj5er/k33wOtXDbt.',
         created_at: '2024-11-23T22:17:26.000Z',
         updated_at: '2024-11-23T22:17:26.000Z',
         country: 'Nigeria',
         state: 'Lagos',
         street: 'Araba street',
       },
     };

     userRepositoryStub.findBy.callsFake(async (query) => {
       return query.email === 'aliadeku.aam@gmail.com'
         ? responseData.user
         : null;
     });

     userRepositoryStub.create.resolves(responseData.user);

     // Act
     const result = await userService.register(registerData);

     // Assert
     expect(result).to.have.property('user');
     expect(result.user).to.have.property('id', 74);
     expect(result.user).to.have.property('name', 'adeku ali');
     expect(result.user).to.have.property('email', 'newuser@example.com');
     expect(result.user).to.have.property('country', 'Nigeria');
     expect(result.user).to.have.property('state', 'Lagos');
     expect(result.user).to.have.property('street', 'Araba street');
   });
 });


});
