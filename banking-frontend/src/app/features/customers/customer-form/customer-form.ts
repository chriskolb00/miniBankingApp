import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateCustomer } from '../../../core/models/create-customer.model';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerFormComponent {
  customer: CreateCustomer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: new Date()
  };

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.validateForm()) {
      this.customerService.create(this.customer).subscribe({
        next: () => {
          this.toastService.success('Customer created successfully');
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.toastService.error('Failed to create customer');
          console.error(err);
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.customer.firstName || !this.customer.lastName) {
      this.toastService.error('First name and last name are required');
      return false;
    }

    if (!this.customer.email || !this.isValidEmail(this.customer.email)) {
      this.toastService.error('Valid email is required');
      return false;
    }

    if (!this.customer.phone) {
      this.toastService.error('Phone number is required');
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
