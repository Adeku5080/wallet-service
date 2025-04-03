export interface AccountResponseInterface {
  account: {
    accountName: string;
    accountNumber: string;
    accoutType: string;
    accountStatus: boolean;
    currency: string;
    balance: number;
    userId: number;
  };
}
