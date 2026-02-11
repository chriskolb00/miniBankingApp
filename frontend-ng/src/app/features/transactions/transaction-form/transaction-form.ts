import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { AccountService } from '../../../core/services/account.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateTransaction } from '../../../core/models/create-transaction.model';
import { Account } from '../../../core/models/account.model';
import { TransactionType } from '../../../core/models/transaction.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
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
  preSelectedAccountId: number | null = null;

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for pre-selected account from query params
    this.route.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.preSelectedAccountId = +params['accountId'];
      }
    });
    
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        
        // If there's a pre-selected account, set it
        if (this.preSelectedAccountId) {
          this.transaction.accountId = this.preSelectedAccountId;
          this.onAccountChange();
        }
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
      // Ensure types are correct before sending
      const transactionData: CreateTransaction = {
        accountId: Number(this.transaction.accountId),
        type: Number(this.transaction.type),
        amount: Number(this.transaction.amount),
        description: this.transaction.description || ''
      };
      
      console.log('Submitting transaction:', transactionData);
      
      this.transactionService.create(transactionData).subscribe({
        next: (result) => {
          console.log('Transaction created successfully:', result);
          this.toastService.success('Transaction created successfully');
          
          // Navigate back to account details if we came from there
          if (this.preSelectedAccountId) {
            this.router.navigate(['/accounts', this.preSelectedAccountId]);
          } else {
            this.router.navigate(['/transactions']);
          }
        },
        error: (err) => {
          console.error('Failed to create transaction:', err);
          console.error('Error details:', err.error);
          
          let errorMessage = 'Failed to create transaction';
          
          // Try to extract a more specific error message
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.error?.title) {
            errorMessage = err.error.title;
          } else if (err.message) {
            errorMessage = err.message;
          } else if (err.error?.errors) {
            // Validation errors from .NET
            const errors = Object.values(err.error.errors).flat();
            errorMessage = errors.join(', ');
          }
          
          this.toastService.error(errorMessage);
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
    // If we came from an account details page, go back there
    if (this.preSelectedAccountId) {
      this.router.navigate(['/accounts', this.preSelectedAccountId]);
    } else {
      this.router.navigate(['/transactions']);
    }
  }
}
