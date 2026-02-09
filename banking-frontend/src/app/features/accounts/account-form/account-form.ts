import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateAccount } from '../../../core/models/create-account.model';
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-account-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-form.html',
  styleUrl: './account-form.scss',
})
export class AccountFormComponent implements OnInit {
  account: CreateAccount = {
    customerId: 0,
    accountNumber: '',
    balance: 0,
    ownerName: ''
  };
  customers: Customer[] = [];

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.generateAccountNumber();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (err) => {
        this.toastService.error('Failed to load customers');
        console.error(err);
      }
    });
  }

  generateAccountNumber(): void {
    const randomNum = Math.floor(Math.random() * 1000000000);
    this.account.accountNumber = `ACC${randomNum.toString().padStart(9, '0')}`;
  }

  onCustomerChange(): void {
    const selectedCustomer = this.customers.find(c => c.id === this.account.customerId);
    if (selectedCustomer) {
      this.account.ownerName = `${selectedCustomer.firstName} ${selectedCustomer.lastName}`;
    }
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.accountService.create(this.account).subscribe({
        next: () => {
          this.toastService.success('Account created successfully');
          this.router.navigate(['/accounts']);
        },
        error: (err) => {
          this.toastService.error('Failed to create account');
          console.error(err);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.account.customerId || this.account.customerId === 0) {
      this.toastService.error('Please select a customer');
      return false;
    }

    if (!this.account.accountNumber) {
      this.toastService.error('Account number is required');
      return false;
    }

    if (this.account.balance < 0) {
      this.toastService.error('Initial balance cannot be negative');
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/accounts']);
  }
}
