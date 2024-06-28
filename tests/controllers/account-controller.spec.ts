import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Request, Response } from 'express';
import { AccountController } from '../../src/controller/account.controller';
import { updateAccountDto } from '../../src/dto/update-account-dto';
import { AccountService } from '../../src/services/account.service';

// chai.use(sinonChai);

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    accountService = {
      createAccount: sinon.stub(),
      withdrawFunds: sinon.stub(),
      fundAccount: sinon.stub(),
      transferFunds: sinon.stub(),
      buildAccountResponse: sinon.stub(),
    } as any;

    accountController = new AccountController(accountService);

    req = {
      headers: {
        id: 'test-id',
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

  describe('createAccount', () => {
    it('should call createAccount on AccountService with the correct parameters', async () => {
      const account = { id: 1, accountName: 'Test Account' };
      const accountResponse = { ...account, balance: 0 };

      (accountService.createAccount as sinon.SinonStub).resolves(account);
      (accountService.buildAccountResponse as sinon.SinonStub).returns(
        accountResponse,
      );

      await accountController.createAcccount(req as Request, res as Response);

      expect(accountService.createAccount).to.have.been.calledWith(req);
      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith(accountResponse);
    });

    it('should handle error from createAccount method and return 500 status', async () => {
      const error = new Error('Account creation failed');

      (accountService.createAccount as sinon.SinonStub).rejects(error);

      try {
        await accountController.createAcccount(req as Request, res as Response);
      } catch (err) {
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: error.message });
      }
    });
  });

  describe('withdrawFunds', () => {
    it('should call withdrawFunds on AccountService with the correct parameters and handle success', async () => {
      const account = { id: 1, accountName: 'Test Account', balance: 500 };
      const updatedAccount = { ...account, balance: 400 };
      const accountResponse = { ...updatedAccount };
      const id = 1;

      (accountService.withdrawFunds as sinon.SinonStub).resolves(
        updatedAccount,
      );
      (accountService.buildAccountResponse as sinon.SinonStub).returns(
        accountResponse,
      );

      await accountController.withdrawFunds(
        id,
        req.body as updateAccountDto,
        res as Response,
      );

      expect(accountService.withdrawFunds).to.have.been.calledWith(
        id,
        req.body,
      );
      expect(accountService.buildAccountResponse).to.have.been.calledWith(
        updatedAccount,
      );
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(accountResponse);
    });

    it('should handle error from withdrawFunds method and return 500 status', async () => {
      const error = new Error('Withdrawal failed');
      const id = 1;

      (accountService.withdrawFunds as sinon.SinonStub).rejects(error);

      try {
        await accountController.withdrawFunds(
          id,
          req.body as updateAccountDto,
          res as Response,
        );
      } catch (err) {
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: error.message });
      }
    });
  });

  describe('fundAccount', () => {
    it('should call fundAccount on AccountService with the correct parameters and handle success', async () => {
      const account = {
        id: 1,
        accountName: 'Test Account',
        balance: 500,
      };
          const fundAccountDto = {
            amount: 120,
            bankName: 'gtb',
            accountNo: 1234568,
            fundingSourceId: 1,
          };
      const updatedAccount = { ...account, balance: 600 };
      const accountResponse = { ...updatedAccount };
      const id = 1;
      (accountService.fundAccount as sinon.SinonStub).resolves(updatedAccount);
      (accountService.buildAccountResponse as sinon.SinonStub).returns(
        accountResponse,
      );
  

      // Call controller method under test
      await accountController.fundAccount(
        id,
        fundAccountDto,
        res as Response,
        req as Request
      );

      // Assertions
      expect(accountService.fundAccount).to.have.been.calledWith(id, req.body);
      expect(accountService.buildAccountResponse).to.have.been.calledWith(
        updatedAccount,
      );
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(accountResponse);
    });

    it('should handle error from fundAccount method and return 500 status', async () => {
      const error = new Error('Funding failed');
      const id = 1;
        const fundAccountDto = {
          amount: 120,
          bankName: 'gtb',
          accountNo: 1234568,
          fundingSourceId: 1,
        };
      
      

      (accountService.fundAccount as sinon.SinonStub).rejects(error);

      try {
        await accountController.fundAccount(
          id,
          fundAccountDto,
          res as Response,
          req as Request,
        );
      } catch (err) {
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: error.message });
      }
    });
  });

  describe('transfer', () => {
    it('should call transferFunds on AccountService with the correct parameters and handle success', async () => {
      const id = 1;
      const account = {
        id: 1,
        accountName: 'Test Account',
        balance: 400,
      };
      const updatedAccount = { ...account, balance: 300 };
      const accountResponse = { ...updatedAccount };

      (accountService.transferFunds as sinon.SinonStub).resolves(
        updatedAccount,
      );
      (accountService.buildAccountResponse as sinon.SinonStub).returns(
        accountResponse,
      );

      await accountController.transferFunds(
        id,
        req.body as updateAccountDto,
        res as Response,
      );

      expect(accountService.transferFunds).to.have.been.calledWith(
        id,
        req.body,
      );
      expect(accountService.buildAccountResponse).to.have.been.calledWith(
        updatedAccount,
      );
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(accountResponse);
    });

    it('should handle error from transferFunds method and return 500 status', async () => {
      const error = new Error('Transfer failed');
      const id = 1;
      (accountService.transferFunds as sinon.SinonStub).rejects(error);

      try {
        await accountController.transferFunds(
          id,
          req.body as updateAccountDto,
          res as Response,
        );
      } catch (err) {
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ error: error.message });
      }
    });
  });
});
