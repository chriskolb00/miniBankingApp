import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account } from '../models/account.model';
import { CreateAccount } from '../models/create-account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  create(account: CreateAccount): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }
}
