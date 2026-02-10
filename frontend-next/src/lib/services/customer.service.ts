import { ApiService } from './api.service';
import { Customer, CreateCustomer } from '../models/customer.model';

export class CustomerService {
  private static endpoint = '/api/customers';

  static async getAll(): Promise<Customer[]> {
    return ApiService.get<Customer[]>(this.endpoint);
  }

  static async getById(id: number): Promise<Customer> {
    return ApiService.get<Customer>(`${this.endpoint}/${id}`);
  }

  static async create(customer: CreateCustomer): Promise<Customer> {
    return ApiService.post<Customer>(this.endpoint, customer);
  }

  static async update(id: number, customer: CreateCustomer): Promise<Customer> {
    return ApiService.put<Customer>(`${this.endpoint}/${id}`, customer);
  }

  static async delete(id: number): Promise<void> {
    return ApiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

