import { Service } from 'typedi';
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../types/acount-type';
import { UserRepository } from '../repository/user.repository';
import { countryCurrencyMap } from '../helpers/country-currency-map';
import { Recepient } from '../types/recepient';
import Redis from 'ioredis';
import { AccountResponseInterface } from '../types/account-response';
import { updateAccountDto } from '../dto/update-account-dto';
import { CustomError } from '../errors/custom-error';
import { TransactionRepistory } from '../repository/transaction.repository';

@Service()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepistory,
  ) {}

  //todo: type for id
  public async createAccount(id: number) {
    try {
      const user = await this.userRepository.findBy({ id });

      if (!user) {
        throw new CustomError('User with this id doesnt exist', 400);
      }

      //check if user already has an account
      const alreadyHasAnAccount = await this.accountRepository.findBy({
        userId: id,
      });
      if (alreadyHasAnAccount) {
        throw new CustomError('This user already has an existing account', 400);
      }

      let currency = countryCurrencyMap[user.country];

      if (!currency) {
        throw new CustomError('Invalid currency', 400);
      }

      const accountNumber = this.generateAccountNumber();

      const account = {
        accountName: user.name,
        accountNumber,
        accountStatus: true,
        userId: user.id,
        currency,
      };

      const [accountId] = await this.accountRepository.create(account);
      const newAccount = await this.accountRepository.findBy({ id: accountId });
      return this.buildAccountResponse(newAccount);
    } catch (err) {
      throw err;
    }
  }

  //todo: use actual types
  public async withdrawFunds(id: number, body: updateAccountDto) {
    let redis: Redis;
    const key = `account-withdrawal-${id}`;

    //todo: redis class
    try {
      redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
      });
    } catch (error) {
      throw new CustomError('server error', 500);
    }

    try {
      const isSet = await redis.set(key, 'true', 'EX', 3600);
      if (!isSet) {
        throw new CustomError(
          'you cannot perform two withdrawals concurrently',
          400,
        );
      }
    } catch (err) {
      console.error('Error setting Redis key:', err);
      throw new CustomError('server error', 500);
    }

    try {
      // Fetch account details
      const account = await this.accountRepository.findBy({ id });
      if (!account) {
        throw new CustomError('Account with this Id does not exist', 400);
      }
      // Check if account balance is sufficient
      if (account.balance <= body.amount) {
        throw new CustomError('insufficient balance', 400);
      }

      const transaction = {
        transactionType: 'withdrawal',
        amount: body.amount,
        userId: id,
        accountId: account.id,
        currency: account.currency,
      };

      //creat transaction
      await this.transactionRepository.create(transaction);

      // Update account balance
      const newBalance = account.balance - Number(body.amount);
      const changes = { balance: newBalance };
      const updatedAccount = await this.accountRepository.update(id, changes);
      return this.buildAccountResponse(updatedAccount);

      //create trasanction

      // TODO: send to a withdrawal source
      //TODO: explain how this will happen
    } catch (err) {
      console.error('Error during withdrawal:', err);
      throw err;
    } finally {
      try {
        await redis.del(key);
      } catch (err) {
        throw new CustomError('server error', 500);
      }
    }
  }

  public async fundAccount(id: number, body: updateAccountDto) {
    try {
      const account = await this.accountRepository.findBy({ id });
      if (!account) {
        throw new CustomError('Account with this Id does not exist', 400);
      }
      const newBalance = account.balance + body.amount;

      const changes = {
        balance: newBalance,
      };

      //create a transaction
      const transaction = {
        transactionType: 'withdrawal',
        amount: body.amount,
        userId: id,
        accountId: account.id,
        currency: account.currency,
      };

      await this.transactionRepository.create(transaction);

      //update account
      const updatedAccount = await this.accountRepository.update(id, changes);
      return this.buildAccountResponse(updatedAccount);
    } catch (err) {
      throw err;
    }
    //integrate paystack to initiate the debit
  }

  public async transferFunds(id: number, body: updateAccountDto) {
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
          400,
        );
      }

      // Fetch account details
      const account = await this.accountRepository.findBy({ id });
      if (!account) {
        throw new CustomError('Account with this Id does not exist', 400);
      }
      if (account.balance <= body.amount) {
        throw new CustomError('insufficient balance', 400);
      }

      //create a transaction
      const transaction = {
        transactionType: 'withdrawal',
        amount: body.amount,
        userId: id,
        accountId: account.id,
        currency: account.currency,
      };

      await this.transactionRepository.create(transaction);

      // Update account balance
      const newBalance = account.balance - body.amount;
      const changes = { balance: newBalance };
      const updatedAccount = this.accountRepository.update(id, changes);
      return this.buildAccountResponse(updatedAccount);

      // TODO: Implement logic to transfer amount to the recipient
    } catch (err) {
      throw err;
    } finally {
      // Clear the Redis key
      try {
      } catch (err) {
        throw err;
      }
    }
  }

  public async getAllAccounts(id: number) {
    return await this.accountRepository.findAll({ userId: id });
  }

  public async getAccountBalance(id: number) {
    const account = await this.accountRepository.findBy({ id });
    if (!account) {
      throw new CustomError('Account with this Id does not exist', 400);
    }

    return account.balance;
  }
  // todo: account should 10 digit numbers
  // add bank name and bank code to account table.
  private generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  };

  buildAccountResponse(account: any): AccountResponseInterface {
    return {
      account: {
        ...account,
      },
    };
  }
}
