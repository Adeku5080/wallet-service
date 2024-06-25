import {
  Body,
  Get,
  JsonController,
  Param,
  Res,
  Params,
  Patch,
  Post,
  Req,
  UseBefore,
} from 'routing-controllers';
import { AccountService } from '../services/AccountService';
// import { CreateAcccountDto } from '../dto/create-account-dto';
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import { Recepient } from '../types/recepient';
import { updateAccountDto } from '../dto/update-account-dto';

@Service()
@UseBefore(AuthMiddleware)
@JsonController('/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/')
  async createAcccount(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.headers;

      const account = await this.accountService.createAccount(id);
      const accountResponse = this.accountService.buildAccountResponse(account);
      return res.status(201).json(accountResponse);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/balance')
  async getAccountBalance(@Req() req: Request) {
    try {
      const { id } = req.headers;

      const account = await this.accountService.getAccountBalance(id);
      console.log(account.balance);
      return account.balance;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/:id/withdraw')
  async withdrawFunds(@Param('id') id: any, @Body() body: updateAccountDto) {
    console.log(body, 'body');
    try {
      await this.accountService.withdrawFunds(id, body);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/:id/fund')
  async fundAccount(@Param('id') id: any, @Body() body: updateAccountDto) {
    try {
      const account = await this.accountService.fundAccount(id, body);
      return this.accountService.buildAccountResponse(account);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Patch('/:id/transfer')
  async transferFunds(@Param('id') id: any, @Body() body: updateAccountDto) {
    console.log(id, 'account we want to transfer too');
    try {
      const account = await this.accountService.transferFunds(id, body);
      return this.accountService.buildAccountResponse(account);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('/')
  async getAllAccounts(@Req() req: Request) {
    try {
      const { id } = req.headers;
      const accounts = await this.accountService.getAllAccounts(id);
      return this.accountService.buildAccountResponse(accounts);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
