'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import { AccountService } from '@/lib/services/account.service';
import { TransactionService } from '@/lib/services/transaction.service';
import { Account } from '@/lib/models/account.model';
import { Transaction } from '@/lib/models/transaction.model';
import { formatCurrency, formatDateTime, getTransactionTypeLabel } from '@/lib/utils/formatters';
import styles from '../../customers/[id]/page.module.scss';

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAccountData();
    }
  }, [id]);

  const loadAccountData = async () => {
    try {
      const [accountData, transactionsData] = await Promise.all([
        AccountService.getById(id),
        TransactionService.getByAccountId(id),
      ]);
      setAccount(accountData);
      setTransactions(
        transactionsData.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    } catch (error) {
      console.error('Failed to load account data:', error);
      router.push('/accounts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading account details..." />;
  }

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <div className={styles.customerDetails}>
      <div className={styles.header}>
        <h1>Account Details</h1>
        <div className={styles.actions}>
          <Link href="/accounts">
            <Button variant="secondary">Back to List</Button>
          </Link>
          <Link href={`/transactions/new?accountId=${account.id}`}>
            <Button variant="primary">+ New Transaction</Button>
          </Link>
        </div>
      </div>

      <div className={styles.detailsCard}>
        <h2 style={{ marginBottom: '1rem' }}>Current Balance</h2>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#059669', marginBottom: '2rem' }}>
          {formatCurrency(account.balance)}
        </div>

        <h2 style={{ marginBottom: '1rem' }}>Account Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Account Number:</span>
            <span className={styles.value}>{account.accountNumber}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Owner Name:</span>
            <span className={styles.value}>{account.ownerName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Customer ID:</span>
            <span className={styles.value}>
              <Link href={`/customers/${account.customerId}`}>{account.customerId}</Link>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Account ID:</span>
            <span className={styles.value}>{account.id}</span>
          </div>
        </div>
      </div>

      <div className={styles.accountsSection}>
        <h2>Transaction History ({transactions.length})</h2>

        {transactions.length > 0 ? (
          <div className={styles.accountsTable}>
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Balance Before</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDateTime(transaction.timestamp)}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background:
                            transaction.type === 0
                              ? '#d1fae5'
                              : transaction.type === 1
                              ? '#fee2e2'
                              : '#dbeafe',
                          color:
                            transaction.type === 0
                              ? '#065f46'
                              : transaction.type === 1
                              ? '#991b1b'
                              : '#1e40af',
                        }}
                      >
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: 600,
                        color: transaction.type === 0 ? '#059669' : transaction.type === 1 ? '#dc2626' : '#111827',
                      }}
                    >
                      {transaction.type === 1 ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td>{transaction.description}</td>
                    <td>{formatCurrency(transaction.balanceBefore)}</td>
                    <td>{formatCurrency(transaction.balanceAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noData}>
            <p>No transactions found for this account</p>
            <Link href={`/transactions/new?accountId=${account.id}`}>
              <Button variant="primary">Create First Transaction</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

