import { Controller, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/transactions')
export class TransactionController {
  @Post('/transfer')
  async transferFunds() {
    console.log('funds transferred');
  }
}
