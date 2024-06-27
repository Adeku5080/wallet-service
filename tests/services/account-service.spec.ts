import sinon, { SinonStub } from 'sinon';
import { Request, Response } from 'express';

import { AccountController } from '../../src/controller/account.controller';
import { AccountRepository } from '../../src/repository/account.repository';
import { AccountService } from '../../src/services/account.service';
import { updateAccountDto } from '../../src/dto/update-account-dto';

describe('AccountService', () => {
  let mockAccountService: AccountService;
  let accountController: AccountController;
  let mockAccountRepository: sinon.SinonStubbedInstance<AccountRepository>;

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockAccountService = {
      createAccount: sinon.stub(),
      withdrawFunds: sinon.stub(),
      transferFunds: sinon.stub(),
      fundAccount: sinon.stub(),
      buildAccountResponse: sinon.stub(),
    } as any;

    accountController = new AccountController(mockAccountService);

    req = {
      headers: {
        id: 'test-id',
      },
    } as Partial<Request>;

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as Partial<Response>;

    mockAccountRepository = sinon.createStubInstance(AccountRepository);
  });

  describe('createAccount', () => {
    it('should create a new account successfully', async () => {
      const account = {
        id: 8,
        accountName: 'adeku ali',
        accountNumber: 'ACCT-1719330668527-944311',
        accountType: 'wallet',
        accountStatus: 1,
        currency: 'NGN',
        balance: 0,
        userId: 65,
      };
      (mockAccountService.createAccount as SinonStub).resolves(account);
      (mockAccountService.buildAccountResponse as SinonStub).returns(account);

      await accountController.createAcccount(req as Request, res as Response);
      sinon.assert.calledWith(res.status as SinonStub, 201);
      sinon.assert.calledWith(res.json as SinonStub, account);
    });
  });

  describe('withdrawFunds', () => {
    it('should withdraw funds successfully', async () => {
      const body = req.body as updateAccountDto;
      const id = 1;
      const account = {
        id: 8,
        accountName: 'adeku ali',
        accountNumber: 'ACCT-1719330668527-944311',
        accountType: 'wallet',
        accountStatus: 1,
        currency: 'NGN',
        balance: 0,
        userId: 65,
      };
      (mockAccountService.withdrawFunds as SinonStub).resolves(account);
      (mockAccountService.buildAccountResponse as SinonStub).returns(account);

      await accountController.withdrawFunds(id, body, res as Response);
    });

    it('should return insufficient funds when amount to withdraw is greater than account balance', async () => {
      const body = req.body as updateAccountDto;
      const id = 1;
      const account = {
        id: 8,
        accountName: 'adeku ali',
        accountNumber: 'ACCT-1719330668527-944311',
        accountType: 'wallet',
        accountStatus: 1,
        currency: 'NGN',
        balance: 0,
        userId: 65,
      };
      const errorMessage = 'Insufficient balance';

      (mockAccountRepository.findBy as SinonStub)
        .withArgs({ id })
        .resolves(account);

      await accountController.withdrawFunds(id, body, res as Response);

      try {
        await accountController.withdrawFunds(id, body, res as Response);
      } catch (err) {
        sinon.assert.calledWith(res.status as SinonStub, 400);
        sinon.assert.calledWith(res.json as SinonStub, {
          message: errorMessage,
        });
      }
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds successfully', async () => {
      const body = req.body as updateAccountDto;
      const id = 1;
      const account = {
        id: 8,
        accountName: 'adeku ali',
        accountNumber: 'ACCT-1719330668527-944311',
        accountType: 'wallet',
        accountStatus: 1,
        currency: 'NGN',
        balance: 0,
        userId: 65,
      };
      (mockAccountService.withdrawFunds as SinonStub).resolves(account);
      (mockAccountService.buildAccountResponse as SinonStub).returns(account);

      await accountController.transferFunds(id, body, res as Response);
    });

    it('should return insufficient funds when amount to transfer is greater than account balance', async () => {
      const body = req.body as updateAccountDto;
      const id = 1;
      const account = {
        id: 8,
        accountName: 'adeku ali',
        accountNumber: 'ACCT-1719330668527-944311',
        accountType: 'wallet',
        accountStatus: 1,
        currency: 'NGN',
        balance: 0,
        userId: 65,
      };
      const errorMessage = 'Insufficient balance';

      (mockAccountRepository.findBy as SinonStub)
        .withArgs({ id })
        .resolves(account);

      await accountController.transferFunds(id, body, res as Response);

      try {
        await accountController.transferFunds(id, body, res as Response);
      } catch (err) {
        sinon.assert.calledWith(res.status as SinonStub, 400);
        sinon.assert.calledWith(res.json as SinonStub, {
          message: errorMessage,
        });
      }
    });
  });

  describe('fundAccount', () => {});
  it('should fund account successfully', async () => {
    const body = req.body as updateAccountDto;
    const id = 1;
    const account = {
      id: 8,
      accountName: 'adeku ali',
      accountNumber: 'ACCT-1719330668527-944311',
      accountType: 'wallet',
      accountStatus: 1,
      currency: 'NGN',
      balance: 0,
      userId: 65,
    };

    (mockAccountRepository.findBy as SinonStub)
      .withArgs({ id })
      .resolves(account);

    await accountController.fundAccount(id, body, res as Response);
  });
});
