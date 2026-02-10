import { ApiService } from './api.service';
import { Transaction, CreateTransaction } from '../models/transaction.model';

export class TransactionService {
  private static endpoint = '/api/transactions';

  static async getAll(): Promise<Transaction[]> {
    return ApiService.get<Transaction[]>(this.endpoint);
  }

  static async getById(id: number): Promise<Transaction> {
    return ApiService.get<Transaction>(`${this.endpoint}/${id}`);
  }

  static async getByAccountId(accountId: number): Promise<Transaction[]> {
    return ApiService.get<Transaction[]>(`${this.endpoint}/account/${accountId}`);
  }

  static async create(transaction: CreateTransaction): Promise<Transaction> {
    return ApiService.post<Transaction>(this.endpoint, transaction);
  }
}

