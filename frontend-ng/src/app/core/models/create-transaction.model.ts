import { TransactionType } from './transaction.model';

export interface CreateTransaction {
  accountId: number;
  type: TransactionType;
  amount: number;
  description: string;
}
