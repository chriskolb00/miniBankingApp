import { ApiService } from './api.service';
import { Account, CreateAccount } from '../models/account.model';

export class AccountService {
  private static endpoint = '/api/accounts';

  static async getAll(): Promise<Account[]> {
    return ApiService.get<Account[]>(this.endpoint);
  }

  static async getById(id: number): Promise<Account> {
    return ApiService.get<Account>(`${this.endpoint}/${id}`);
  }

  static async create(account: CreateAccount): Promise<Account> {
    return ApiService.post<Account>(this.endpoint, account);
  }

  static async update(id: number, account: CreateAccount): Promise<Account> {
    return ApiService.put<Account>(`${this.endpoint}/${id}`, account);
  }

  static async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

