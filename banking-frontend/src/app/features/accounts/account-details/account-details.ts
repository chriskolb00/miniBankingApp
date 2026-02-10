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
  accountId: number = 0;

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
      },
      error: (err) => {
        this.toastService.error('Failed to load transactions');
        console.error(err);
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
