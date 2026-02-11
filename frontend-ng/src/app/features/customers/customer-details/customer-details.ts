import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { AccountService } from '../../../core/services/account.service';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../core/models/customer.model';
import { Account } from '../../../core/models/account.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, RouterModule, CurrencyFormatPipe, ConfirmationModalComponent],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss',
})
export class CustomerDetailsComponent implements OnInit {
  customer: Customer | null = null;
  accounts: Account[] = [];
  customerId: number = 0;
  showDeleteModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.loadCustomerDetails();
      this.loadCustomerAccounts();
    });
  }

  loadCustomerDetails(): void {
    this.customerService.getById(this.customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (err) => {
        this.toastService.error('Failed to load customer details');
        console.error(err);
        this.router.navigate(['/customers']);
      }
    });
  }

  loadCustomerAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts.filter(acc => acc.customerId === this.customerId);
      },
      error: (err) => {
        this.toastService.error('Failed to load customer accounts');
        console.error(err);
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.customerService.delete(this.customerId).subscribe({
      next: () => {
        this.toastService.success('Customer deleted successfully');
        this.closeDeleteModal();
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.toastService.error('Failed to delete customer');
        console.error(err);
        this.closeDeleteModal();
      }
    });
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }
}
