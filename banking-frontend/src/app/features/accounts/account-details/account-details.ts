import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { ToastService } from '../../../core/services/toast.service';
import { Account } from '../../../core/models/account.model';
import { Transaction } from '../../../core/models/transaction.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';

@Component({
  selector: 'app-account-details',
  imports: [CommonModule, RouterModule, CurrencyFormatPipe],
  templateUrl: './account-details.html',
  styleUrl: './account-details.scss',
})
export class AccountDetailsComponent implements OnInit {
  account: Account | null = null;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  accountId: number = 0;
  selectedType: string = 'all';

  // Summary statistics
  totalDeposits: number = 0;
  totalWithdrawals: number = 0;
  totalTransfers: number = 0;
  depositCount: number = 0;
  withdrawalCount: number = 0;
  transferCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = +params['id'];
      this.loadAccountDetails();
      this.loadTransactions();
    });
  }

  loadAccountDetails(): void {
    this.accountService.getById(this.accountId).subscribe({
      next: (account) => {
        this.account = account;
      },
      error: (err) => {
        this.toastService.error('Failed to load account details');
        console.error(err);
        this.router.navigate(['/accounts']);
      }
    });
  }

  loadTransactions(): void {
    this.transactionService.getByAccountId(this.accountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.filteredTransactions = transactions;
        this.calculateSummary();
      },
      error: (err) => {
        this.toastService.error('Failed to load transactions');
        console.error(err);
      }
    });
  }

  calculateSummary(): void {
    this.totalDeposits = this.transactions
      .filter(t => t.type === 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.totalWithdrawals = this.transactions
      .filter(t => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.totalTransfers = this.transactions
      .filter(t => t.type === 2)
      .reduce((sum, t) => sum + t.amount, 0);

    this.depositCount = this.transactions.filter(t => t.type === 0).length;
    this.withdrawalCount = this.transactions.filter(t => t.type === 1).length;
    this.transferCount = this.transactions.filter(t => t.type === 2).length;
  }

  filterByType(type: string): void {
    this.selectedType = type;
    
    if (type === 'all') {
      this.filteredTransactions = this.transactions;
    } else {
      const typeValue = type === 'deposit' ? 0 : type === 'withdrawal' ? 1 : 2;
      this.filteredTransactions = this.transactions.filter(t => t.type === typeValue);
    }
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
