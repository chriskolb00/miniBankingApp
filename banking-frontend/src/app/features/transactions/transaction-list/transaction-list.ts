import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { ToastService } from '../../../core/services/toast.service';
import { Transaction, TransactionType } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  selectedType: string = 'all';

  constructor(
    private transactionService: TransactionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAll().subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.filteredTransactions = transactions;
      },
      error: (err) => {
        this.toastService.error('Failed to load transactions');
        console.error(err);
      }
    });
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
