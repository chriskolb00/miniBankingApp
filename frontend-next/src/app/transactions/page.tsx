'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import { TransactionService } from '@/lib/services/transaction.service';
import { Transaction } from '@/lib/models/transaction.model';
import { formatCurrency, formatDateTime, getTransactionTypeLabel } from '@/lib/utils/formatters';
import styles from './page.module.scss';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredTransactions(transactions);
    } else {
      const typeValue = selectedType === 'deposit' ? 0 : selectedType === 'withdrawal' ? 1 : 2;
      setFilteredTransactions(transactions.filter((t) => t.type === typeValue));
    }
  }, [selectedType, transactions]);

  const loadTransactions = async () => {
    try {
      const data = await TransactionService.getAll();
      const sorted = data.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTransactions(sorted);
      setFilteredTransactions(sorted);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading transactions..." />;
  }

  return (
    <div className={styles.transactionsPage}>
      <div className={styles.header}>
        <h1>Transactions</h1>
        <Link href="/transactions/new">
          <Button variant="primary">+ New Transaction</Button>
        </Link>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${selectedType === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedType('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${styles.deposit} ${
            selectedType === 'deposit' ? styles.active : ''
          }`}
          onClick={() => setSelectedType('deposit')}
        >
          Deposits
        </button>
        <button
          className={`${styles.filterBtn} ${styles.withdrawal} ${
            selectedType === 'withdrawal' ? styles.active : ''
          }`}
          onClick={() => setSelectedType('withdrawal')}
        >
          Withdrawals
        </button>
        <button
          className={`${styles.filterBtn} ${styles.transfer} ${
            selectedType === 'transfer' ? styles.active : ''
          }`}
          onClick={() => setSelectedType('transfer')}
        >
          Transfers
        </button>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className={styles.transactionsTable}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Account ID</th>
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
                  <td>{transaction.id}</td>
                  <td>{formatDateTime(transaction.timestamp)}</td>
                  <td>
                    <Link href={`/accounts/${transaction.accountId}`}>
                      {transaction.accountId}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        transaction.type === 0
                          ? styles.deposit
                          : transaction.type === 1
                          ? styles.withdrawal
                          : styles.transfer
                      }`}
                    >
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td
                    className={`${styles.amount} ${
                      transaction.type === 0
                        ? styles.positive
                        : transaction.type === 1
                        ? styles.negative
                        : ''
                    }`}
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
          <p>No transactions found</p>
          <Link href="/transactions/new">
            <Button variant="primary">Create Your First Transaction</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

