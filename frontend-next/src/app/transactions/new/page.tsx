'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import { TransactionService } from '@/lib/services/transaction.service';
import { AccountService } from '@/lib/services/account.service';
import { Account } from '@/lib/models/account.model';
import { CreateTransaction, TransactionType } from '@/lib/models/transaction.model';
import { formatCurrency, generateAccountNumber } from '@/lib/utils/formatters';
import styles from '../../customers/new/page.module.scss';

export default function NewTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedAccountId = searchParams.get('accountId');

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateTransaction>({
    accountId: preSelectedAccountId ? Number(preSelectedAccountId) : 0,
    type: TransactionType.Deposit,
    amount: 0,
    description: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (formData.accountId) {
      const account = accounts.find((a) => a.id === formData.accountId);
      setSelectedAccount(account || null);
    }
  }, [formData.accountId, accounts]);

  const loadAccounts = async () => {
    try {
      const data = await AccountService.getAll();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const getExpectedBalance = () => {
    if (!selectedAccount) return 0;

    if (formData.type === TransactionType.Deposit) {
      return selectedAccount.balance + formData.amount;
    } else if (formData.type === TransactionType.Withdrawal) {
      return selectedAccount.balance - formData.amount;
    }

    return selectedAccount.balance;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.accountId === 0) {
      alert('Please select an account');
      return;
    }

    if (formData.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (
      formData.type === TransactionType.Withdrawal &&
      selectedAccount &&
      formData.amount > selectedAccount.balance
    ) {
      alert('Insufficient funds for withdrawal');
      return;
    }

    setSubmitting(true);

    try {
      await TransactionService.create(formData);
      if (preSelectedAccountId) {
        router.push(`/accounts/${preSelectedAccountId}`);
      } else {
        router.push('/transactions');
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      alert('Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formPage}>
      <div className={styles.formContainer}>
        <h1>New Transaction</h1>

        {preSelectedAccountId && selectedAccount && (
          <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            ℹ️ Creating transaction for account: <strong>{selectedAccount.accountNumber}</strong> (
            {selectedAccount.ownerName})
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="account">Select Account *</label>
            <select
              id="account"
              required
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: Number(e.target.value) })}
            >
              <option value="0">-- Select Account --</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} - {account.ownerName} (Balance:{' '}
                  {formatCurrency(account.balance)})
                </option>
              ))}
            </select>
          </div>

          {selectedAccount && (
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <strong>Current Balance:</strong> {formatCurrency(selectedAccount.balance)}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="type">Transaction Type *</label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) })}
            >
              <option value={TransactionType.Deposit}>Deposit</option>
              <option value={TransactionType.Withdrawal}>Withdrawal</option>
              <option value={TransactionType.Transfer}>Transfer</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              min="0.01"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
          </div>

          {selectedAccount && formData.amount > 0 && (
            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <strong>Expected Balance After Transaction:</strong> {formatCurrency(getExpectedBalance())}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Optional transaction description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.formActions}>
            <Link href={preSelectedAccountId ? `/accounts/${preSelectedAccountId}` : '/transactions'}>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

