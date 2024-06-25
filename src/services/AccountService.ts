import { Service } from 'typedi';
import { AccountRepository } from '../repository/AccountRepository';
import { Account } from '../types/acount-type';
import { UserRepository } from '../repository/UserRepository';
import { countryCurrencyMap } from '../helpers/countryCurrencyMap';
import { Recepient } from '../types/recepient';
import Redis from 'ioredis';
import { AccountResponseInterface } from '../types/account-response';
import { updateAccountDto } from '../dto/update-account-dto';
import { CustomError } from '../errors/customError';

@Service()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
  ) {}

  public async createAccount(id: any) {
    try {
      const accountNumber = this.generateAccountNumber();

      const user = await this.userRepository.findBy({ id });

      if (!user) {
        console.log('user with this id doesnt exist');
      }

      //check if user already has an account
      const alreadyHasAnAccount = await this.accountRepository.findBy({
        userId: id,
      });
      if (alreadyHasAnAccount) {
        throw new CustomError('this user already has an existing account', 401);
      }

      let currency = countryCurrencyMap[user.country];

      if (!currency) {
        throw new CustomError('invalid currency', 401);
      }

      const account = {
        accountName: user.name,
        accountNumber,
        accountStatus: true,
        userId: user.id,
        currency,
      };
      const [accountId] = await this.accountRepository.create(account);
      return await this.accountRepository.findBy({ id: accountId });
    } catch (err) {
      throw err;
    }
  }

  public async withdrawFunds(id: any, body: updateAccountDto) {
    let redis: Redis;
    const key = `account-withdrawal-${id}`;

    try {
      redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
      });
    } catch (error) {
      console.error('Error initializing Redis:', error);
      return;
    }

    try {
      const isSet = await redis.set(key, 'true', 'EX', 3600);
      if (!isSet) {
        throw new CustomError(
          'you cannot perform two withdrawals concurrently',
          401,
        );
      }
    } catch (err) {
      console.error('Error setting Redis key:', err);
      throw err;
    }

    try {
      // Fetch account details
      const account = await this.accountRepository.findBy({ id });
      // Check if account balance is sufficient
      if (account.balance <= body.amount) {
        throw new CustomError('insufficient balance', 401);
      }

      // Update account balance
      const newBalance = account.balance - Number(body.amount);
      const changes = { balance: newBalance };
      await this.accountRepository.update(id, changes);

      // TODO: send to a withdrawal source
    } catch (err) {
      console.error('Error during withdrawal:', err);
      throw err;
    } finally {
      try {
        await redis.del(key);
      } catch (err) {
        console.error('Error clearing Redis key:', err);
        throw err;
      }
    }
  }

  public async fundAccount(id: any, body: updateAccountDto) {
    //accounId
    try {
      const account = await this.accountRepository.findBy({ id });
      const newBalance = account.balance + body.amount;

      const changes = {
        balance: newBalance,
      };

      return await this.accountRepository.update(id, changes);
    } catch (err) {
      console.log(err);
      throw err;
    }
    //integrate paystack to initiate the debit
  }

  public async transferFunds(id: any, body: updateAccountDto) {
    let redis: Redis;
    const key = `account-transfer-${id}`;
    try {
      // Initialize Redis
      redis = new Redis();

      // Prevent concurrent transfers
      const isSet = await redis.set(key, 'true', 'EX', 3600);
      if (!isSet) {
        throw new CustomError(
          'you cannot perform two withdrawals concurrently',
          401,
        );
      }

      // Fetch account details
      const account = await this.accountRepository.findBy({ id });
      if (account.balance <= body.amount) {
        throw new CustomError('insufficient balance', 401);
      }

      // Update account balance
      const newBalance = account.balance - body.amount;
      const changes = { balance: newBalance };
      return await this.accountRepository.update(id, changes);

      // TODO: Implement logic to transfer amount to the recipient
    } catch (err) {
      throw err;
    } finally {
      // Clear the Redis key
      try {
      } catch (err) {
        console.error('Error clearing Redis key:', err);
        throw err;
      }
    }
  }

  public async getAllAccounts(id: any) {
    return await this.accountRepository.findAll({ userId: id });
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

  buildAccountResponse(account: any): AccountResponseInterface {
    return {
      account: {
        ...account,
      },
    };
  }
}
