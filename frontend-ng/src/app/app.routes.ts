import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { CustomerListComponent } from './features/customers/customer-list/customer-list';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form';
import { CustomerDetailsComponent } from './features/customers/customer-details/customer-details';
import { AccountListComponent } from './features/accounts/account-list/account-list';
import { AccountFormComponent } from './features/accounts/account-form/account-form';
import { AccountDetailsComponent } from './features/accounts/account-details/account-details';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list';
import { TransactionFormComponent } from './features/transactions/transaction-form/transaction-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id', component: CustomerDetailsComponent },
  
  { path: 'accounts', component: AccountListComponent },
  { path: 'accounts/new', component: AccountFormComponent },
  { path: 'accounts/:id', component: AccountDetailsComponent },
  
  { path: 'transactions', component: TransactionListComponent },
  { path: 'transactions/new', component: TransactionFormComponent },
];
