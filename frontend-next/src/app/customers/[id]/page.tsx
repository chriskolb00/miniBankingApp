'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import { CustomerService } from '@/lib/services/customer.service';
import { AccountService } from '@/lib/services/account.service';
import { Customer } from '@/lib/models/customer.model';
import { Account } from '@/lib/models/account.model';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import styles from './page.module.scss';

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomerData();
    }
  }, [id]);

  const loadCustomerData = async () => {
    try {
      const [customerData, allAccounts] = await Promise.all([
        CustomerService.getById(id),
        AccountService.getAll(),
      ]);
      setCustomer(customerData);
      setAccounts(allAccounts.filter((acc) => acc.customerId === id));
    } catch (error) {
      console.error('Failed to load customer data:', error);
      router.push('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await CustomerService.delete(id);
        router.push('/customers');
      } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  if (loading) {
    return <Loading message="Loading customer details..." />;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className={styles.customerDetails}>
      <div className={styles.header}>
        <h1>Customer Details</h1>
        <div className={styles.actions}>
          <Link href="/customers">
            <Button variant="secondary">Back to List</Button>
          </Link>
          <Link href={`/accounts/new?customerId=${customer.id}`}>
            <Button variant="primary">+ Create Account</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete Customer
          </Button>
        </div>
      </div>

      <div className={styles.detailsCard}>
        <h2>Personal Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Customer ID:</span>
            <span className={styles.value}>{customer.id}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>
              {customer.firstName} {customer.lastName}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{customer.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Phone:</span>
            <span className={styles.value}>{customer.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Date of Birth:</span>
            <span className={styles.value}>{formatDate(customer.dateOfBirth)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Member Since:</span>
            <span className={styles.value}>{formatDate(customer.createdAt)}</span>
          </div>
          <div className={`${styles.infoItem} ${styles.fullWidth}`}>
            <span className={styles.label}>Address:</span>
            <span className={styles.value}>{customer.address}</span>
          </div>
        </div>
      </div>

      <div className={styles.accountsSection}>
        <div className={styles.sectionHeader}>
          <h2>Accounts ({accounts.length})</h2>
          <div className={styles.totalBalance}>
            Total Balance: <strong>{formatCurrency(getTotalBalance())}</strong>
          </div>
        </div>

        {accounts.length > 0 ? (
          <div className={styles.accountsTable}>
            <table>
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Owner Name</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.accountNumber}</td>
                    <td>{account.ownerName}</td>
                    <td className={styles.balance}>{formatCurrency(account.balance)}</td>
                    <td>
                      <Link href={`/accounts/${account.id}`}>
                        <Button variant="info" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noData}>
            <p>No accounts found for this customer</p>
            <Link href={`/accounts/new?customerId=${customer.id}`}>
              <Button variant="primary">Create Account</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

