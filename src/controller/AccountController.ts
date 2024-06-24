import { Get, JsonController, Patch, Post, Req, UseBefore } from 'routing-controllers';
import { AccountService } from '../services/AccountService';
// import { CreateAcccountDto } from '../dto/create-account-dto';
import { AuthMiddleware } from '../middlewares/auth-middleware';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import { Recepient } from '../types/recepient';

@Service()
@UseBefore(AuthMiddleware)
@JsonController('/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/')
  async createAcccount(@Req() req: Request) {
    try {
      const { id } = req.headers;

      const account = await this.accountService.createAccount(id);
    } catch (err) {
      console.log(err);
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
    }
  }
    
    @Patch('/:id/withdrawal')
    async withdrawFunds(amount:any,recepient:Recepient,id:any) {
         await this.accountService.withdrawFunds(amount,recepient,id)
    }
  
  @Patch('/:id/fund')
  async fundAccount(id:any,amount:any) {
    await this.accountService.fundAccount(id,amount)
  }

  @Post('/transfer') 
  async transferFund(amount:any,id:any) {
    await this.accountService.transferFunds(amount,id)
  }  

  
  
}
