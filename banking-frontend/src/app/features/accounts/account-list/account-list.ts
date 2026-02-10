import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { ToastService } from '../../../core/services/toast.service';
import { Account } from '../../../core/models/account.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';

@Component({
  selector: 'app-account-list',
  imports: [CommonModule, RouterModule, CurrencyFormatPipe],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss',
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];

  constructor(
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.filteredAccounts = accounts;
      },
      error: (err) => {
        this.toastService.error('Failed to load accounts');
        console.error(err);
      }
    });
  }

  searchAccounts(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.filteredAccounts = this.accounts.filter(account =>
      account.accountNumber.toLowerCase().includes(term) ||
      account.ownerName.toLowerCase().includes(term)
    );
  }
}
