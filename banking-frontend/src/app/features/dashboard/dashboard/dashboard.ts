import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Customer } from '../../../core/models/customer.model';
import { Account } from '../../../core/models/account.model';
import { Transaction } from '../../../core/models/transaction.model';
import { SummaryCardComponent } from '../summary-card/summary-card';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, SummaryCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  customerCount = 0;
  accountCount = 0;
  totalBalance = 0;
  recentTransactions: Transaction[] = [];

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.customerService.getAll().subscribe({
      next: (customers: Customer[]) => {
        this.customerCount = customers.length;
      }
    });

    this.accountService.getAll().subscribe({
      next: (accounts: Account[]) => {
        this.accountCount = accounts.length;
        this.totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      }
    });

    this.transactionService.getAll().subscribe({
      next: (transactions: Transaction[]) => {
        this.recentTransactions = transactions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);
      }
    });
  }

  getTransactionTypeLabel(type: number): string {
    switch(type) {
      case 0: return 'Deposit';
      case 1: return 'Withdrawal';
      case 2: return 'Transfer';
      default: return 'Unknown';
    }
  }
}
