import { Service } from 'typedi';
import { AccountRepository } from '../repository/AccountRepository';
import { Account } from '../types/acount-type';
import { UserRepository } from '../repository/UserRepository';
import { countryCurrencyMap } from '../helpers/countryCurrencyMap';
import { Recepient } from '../types/recepient';
import Redis from 'ioredis';

@Service()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
  ) {}

  public async createAccount(id: any) {
    try {
      const accountNumber = this.generateAccountNumber();
      const user = await this.userRepository.findBy({id});

      if (!user) {
        console.log('user with this id doesnt exist');
      }

      //check if user already has an account
      const alreadyHasAnAccount = await this.accountRepository.findBy(id);
      if (alreadyHasAnAccount) {
        console.log('this user already has an existing account');
      }

      let currency = countryCurrencyMap[user.country];

      if (!currency) {
        console.log('invalid currency');
        return;
      }

      const account = {
        accountName: user.name,
        accountNumber,
        accountStatus: true,
        userId: user.id,
        currency,
      };
      await this.accountRepository.create(account);
    } catch (err) {
      console.log(err);
    }
  }

  public async withdrawFunds(amount: any, recepient: Recepient, id: any) {
    const account = await this.accountRepository.findBy(id);
    const redis = new Redis();

    //check if user is trying to perform two withdrawals concurrently
    redis.set(`account-withdrawal-${id}`, 'true', 'EX', 3600);

    //check account balance is insufficient
    if (account.balance < amount) {
      console.log('insufficient balance');
    }

    const newBalance = account.balance - amount;
    const changes = {
      balance: newBalance,
    };

    await this.accountRepository.update(id, changes);

    //todo.send to a withdrawal source
  }

  public async fundAccount(id: any, amount: any) {
    //accounId

    //integrate paystack to initiate the debit
    const account = await this.accountRepository.findBy({ id });
    const newBalance = account.balance + amount;

    const changes = {
      balance: newBalance,
    };

    await this.accountRepository.update(id, changes);
  }

  public async transferFunds(amount: any, id: any) {
    const account = await this.accountRepository.findBy({ id });
     if (account.balance < amount) {
       console.log('insufficient balance');
     }
        const newBalance = account.balance - amount;
     
      const changes = {
      balance: newBalance,
      };
    
        await this.accountRepository.update(id, changes);

    
    
    
  }

  public async getAccountBalance(id: any) {
    const account = await this.accountRepository.findBy({ id });

    return account.balance;
  }
  private generateAccountNumber = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `ACCT-${timestamp}-${randomNum}`;
  };
}
