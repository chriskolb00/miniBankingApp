export enum TransactionType {
  Deposit = 0,
  Withdrawal = 1,
  Transfer = 2
}

export interface Transaction {
  id: number;
  accountId: number;
  type: TransactionType;
  amount: number;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: Date;
}
