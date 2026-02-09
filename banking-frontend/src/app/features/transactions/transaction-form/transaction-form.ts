import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { AccountService } from '../../../core/services/account.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateTransaction } from '../../../core/models/create-transaction.model';
import { Account } from '../../../core/models/account.model';
import { TransactionType } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionFormComponent implements OnInit {
  transaction: CreateTransaction = {
    accountId: 0,
    type: TransactionType.Deposit,
    amount: 0,
    description: ''
  };
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  TransactionType = TransactionType;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (err) => {
        this.toastService.error('Failed to load accounts');
        console.error(err);
      }
    });
  }

  onAccountChange(): void {
    this.selectedAccount = this.accounts.find(a => a.id === this.transaction.accountId) || null;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.transactionService.create(this.transaction).subscribe({
        next: () => {
          this.toastService.success('Transaction created successfully');
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          this.toastService.error('Failed to create transaction');
          console.error(err);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.transaction.accountId || this.transaction.accountId === 0) {
      this.toastService.error('Please select an account');
      return false;
    }

    if (this.transaction.amount <= 0) {
      this.toastService.error('Amount must be greater than 0');
      return false;
    }

    if (this.transaction.type === TransactionType.Withdrawal && this.selectedAccount) {
      if (this.transaction.amount > this.selectedAccount.balance) {
        this.toastService.error('Insufficient funds for withdrawal');
        return false;
      }
    }

    return true;
  }

  getExpectedBalance(): number {
    if (!this.selectedAccount) return 0;
    
    if (this.transaction.type === TransactionType.Deposit) {
      return this.selectedAccount.balance + this.transaction.amount;
    } else if (this.transaction.type === TransactionType.Withdrawal) {
      return this.selectedAccount.balance - this.transaction.amount;
    }
    
    return this.selectedAccount.balance;
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }
}
