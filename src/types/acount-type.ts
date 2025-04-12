import { AccountType } from '../enums/account-type';
import { CurrencyType } from '../enums/currency.type';

export interface Account {
  balance: number;
  currency: CurrencyType;
  accountStatus: boolean;
  accountType: AccountType;
  accountName: string;
}
