import 'mocha';
import sinon from 'sinon';

import { expect } from 'chai';
import { UserService } from '../../../src/services/user.service';
import { UserRepository } from '../../../src/repository/user.repository';
import { JWT } from '../../../src/helpers/jwt';

describe('UserService', () => {
  let userRepositoryStub: sinon.SinonStubbedInstance<UserRepository>;
  let userService: UserService;
  let jwt :sinon.SinonStubbedInstance<JWT>

  beforeEach(() => {
    userRepositoryStub = sinon.createStubInstance(UserRepository);
    jwt = sinon.createStubInstance(jwt)
    userService = new UserService(userRepositoryStub, JWT:jwt);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => { });
  it("should register the user", () => {
    
  })
});
