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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  // Summary statistics
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [depositCount, setDepositCount] = useState(0);
  const [withdrawalCount, setWithdrawalCount] = useState(0);
  const [transferCount, setTransferCount] = useState(0);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredTransactions(transactions);
    } else {
      const typeValue = selectedType === 'deposit' ? 0 : selectedType === 'withdrawal' ? 1 : 2;
      setFilteredTransactions(transactions.filter((t) => t.type === typeValue));
    }
  }, [selectedType, transactions]);

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
      const sortedTransactions = transactionsData.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
      calculateSummary(sortedTransactions);
    } catch (error) {
      console.error('Failed to load account data:', error);
      router.push('/accounts');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (transactionsList: Transaction[]) => {
    const deposits = transactionsList.filter((t) => t.type === 0);
    const withdrawals = transactionsList.filter((t) => t.type === 1);
    const transfers = transactionsList.filter((t) => t.type === 2);

    setTotalDeposits(deposits.reduce((sum, t) => sum + t.amount, 0));
    setTotalWithdrawals(withdrawals.reduce((sum, t) => sum + t.amount, 0));
    setTotalTransfers(transfers.reduce((sum, t) => sum + t.amount, 0));
    setDepositCount(deposits.length);
    setWithdrawalCount(withdrawals.length);
    setTransferCount(transfers.length);
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

        {/* Transaction Summary Cards */}
        {transactions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '0.75rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #059669',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '2rem' }}>💰</div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Deposits</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669', marginBottom: '0.125rem' }}>{formatCurrency(totalDeposits)}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{depositCount} transaction{depositCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div style={{ 
              background: 'white', 
              borderRadius: '0.75rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '2rem' }}>💸</div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Withdrawals</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.125rem' }}>{formatCurrency(totalWithdrawals)}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{withdrawalCount} transaction{withdrawalCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div style={{ 
              background: 'white', 
              borderRadius: '0.75rem', 
              padding: '1.25rem', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #2563eb',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '2rem' }}>🔄</div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Transfers</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.125rem' }}>{formatCurrency(totalTransfers)}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{transferCount} transaction{transferCount !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {transactions.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedType('all')}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${selectedType === 'all' ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                background: selectedType === 'all' ? '#3b82f6' : 'white',
                color: selectedType === 'all' ? 'white' : '#111827',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setSelectedType('deposit')}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${selectedType === 'deposit' ? '#059669' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                background: selectedType === 'deposit' ? '#059669' : 'white',
                color: selectedType === 'deposit' ? 'white' : '#111827',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              Deposits ({depositCount})
            </button>
            <button
              onClick={() => setSelectedType('withdrawal')}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${selectedType === 'withdrawal' ? '#dc2626' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                background: selectedType === 'withdrawal' ? '#dc2626' : 'white',
                color: selectedType === 'withdrawal' ? 'white' : '#111827',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              Withdrawals ({withdrawalCount})
            </button>
            <button
              onClick={() => setSelectedType('transfer')}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${selectedType === 'transfer' ? '#2563eb' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                background: selectedType === 'transfer' ? '#2563eb' : 'white',
                color: selectedType === 'transfer' ? 'white' : '#111827',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              Transfers ({transferCount})
            </button>
          </div>
        )}

        {filteredTransactions.length > 0 ? (
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
                {filteredTransactions.map((transaction) => (
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

