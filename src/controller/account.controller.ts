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
import { AccountService } from '../services/account.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Request, Response } from 'express';
import { Service } from 'typedi';
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

      const account = await this.accountService.createAccount(Number(id));
      const data = this.accountService.buildAccountResponse(account);
      return res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:id/withdraw')
  async withdrawFunds(
    @Param('id') id: number,
    @Body() body: updateAccountDto,
    @Res() res: Response,
  ) {
    try {
      const account = await this.accountService.withdrawFunds(id, body);
      const data = this.accountService.buildAccountResponse(account);
      return res.status(200).json({
        status: 'success',
        message: 'Withdrawal successful',
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:id/fund')
  async fundAccount(
    @Param('id') id: number,
    @Body() body: updateAccountDto,
    @Res() res: Response,
  ) {
    try {
      const account = await this.accountService.fundAccount(id, body);
      const data = this.accountService.buildAccountResponse(account);
      return res.status(200).json({
        status: 'success',
        message: 'Account funded successfully',
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  @Patch('/:id/transfer')
  async transferFunds(
    @Param('id') id: number,
    @Body() body: updateAccountDto,
    @Res() res: Response,
  ) {
    try {
      const account = await this.accountService.transferFunds(id, body);
      const data = this.accountService.buildAccountResponse(account);
      return res.status(200).json({
        status: 'success',
        message: 'Transfer successful',
        data,
      });
    } catch (err) {
      throw err;
    }
  }

  @Get('/balance')
  async getAccountBalance(@Req() req: Request) {
    try {
      const { id } = req.headers;

      const account = await this.accountService.getAccountBalance(Number(id));
      return account.balance;
    } catch (err) {
      throw err;
    }
  }

  @Get('/')
  async getAllAccounts(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.headers;
      const accounts = await this.accountService.getAllAccounts(Number(id));
      console.log(accounts, 'accounts');
      const data = this.accountService.buildAccountResponse(accounts);
      return res.status(200).json(data);
    } catch (err) {
      throw err;
    }
  }
}
