'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import { AccountService } from '@/lib/services/account.service';
import { CustomerService } from '@/lib/services/customer.service';
import { Customer } from '@/lib/models/customer.model';
import { CreateAccount } from '@/lib/models/account.model';
import { generateAccountNumber } from '@/lib/utils/formatters';
import styles from '../customers/new/page.module.scss';

export default function NewAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCustomerId = searchParams.get('customerId');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateAccount>({
    customerId: preSelectedCustomerId ? Number(preSelectedCustomerId) : 0,
    accountNumber: generateAccountNumber(),
    ownerName: '',
    balance: 0,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find((c) => c.id === formData.customerId);
      if (customer) {
        setFormData((prev) => ({
          ...prev,
          ownerName: `${customer.firstName} ${customer.lastName}`,
        }));
      }
    }
  }, [formData.customerId, customers]);

  const loadCustomers = async () => {
    try {
      const data = await CustomerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const handleGenerateAccountNumber = () => {
    setFormData({ ...formData, accountNumber: generateAccountNumber() });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.customerId === 0) {
      alert('Please select a customer');
      return;
    }

    setSubmitting(true);

    try {
      await AccountService.create(formData);
      if (preSelectedCustomerId) {
        router.push(`/customers/${preSelectedCustomerId}`);
      } else {
        router.push('/accounts');
      }
    } catch (error) {
      console.error('Failed to create account:', error);
      alert('Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === formData.customerId);

  return (
    <div className={styles.formPage}>
      <div className={styles.formContainer}>
        <h1>Create New Account</h1>

        {preSelectedCustomerId && selectedCustomer && (
          <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            ℹ️ Creating account for customer: <strong>{selectedCustomer.firstName} {selectedCustomer.lastName}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="customer">Select Customer *</label>
            <select
              id="customer"
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
            >
              <option value="0">-- Select Customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="accountNumber">Account Number *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                id="accountNumber"
                required
                readOnly
                value={formData.accountNumber}
                style={{ flex: 1 }}
              />
              <Button variant="secondary" type="button" onClick={handleGenerateAccountNumber}>
                Generate
              </Button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ownerName">Owner Name *</label>
            <input
              type="text"
              id="ownerName"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="balance">Initial Balance *</label>
            <input
              type="number"
              id="balance"
              min="0"
              step="0.01"
              required
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
            />
          </div>

          <div className={styles.formActions}>
            <Link href={preSelectedCustomerId ? `/customers/${preSelectedCustomerId}` : '/accounts'}>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

