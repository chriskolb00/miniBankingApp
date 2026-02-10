'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/shared/Card';
import Loading from '@/components/shared/Loading';
import Button from '@/components/shared/Button';
import { CustomerService } from '@/lib/services/customer.service';
import { AccountService } from '@/lib/services/account.service';
import { TransactionService } from '@/lib/services/transaction.service';
import { Account } from '@/lib/models/account.model';
import { Transaction } from '@/lib/models/transaction.model';
import { formatCurrency, formatDateTime, getTransactionTypeLabel } from '@/lib/utils/formatters';
import styles from './page.module.scss';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [customerCount, setCustomerCount] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [customers, accounts, transactions] = await Promise.all([
        CustomerService.getAll(),
        AccountService.getAll(),
        TransactionService.getAll(),
      ]);

      setCustomerCount(customers.length);
      setAccountCount(accounts.length);
      setTotalBalance(accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0));
      setRecentTransactions(
        transactions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10)
      );
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Banking Dashboard</h1>

      <div className={styles.summaryCards}>
        <Card
          title="Total Customers"
          value={customerCount.toString()}
          icon="👥"
          href="/customers"
        />
        <Card
          title="Total Accounts"
          value={accountCount.toString()}
          icon="💳"
          href="/accounts"
        />
        <Card title="Total Balance" value={formatCurrency(totalBalance)} icon="💰" />
      </div>

      <div className={styles.recentTransactions}>
        <h2>Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <div className={styles.transactionTable}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
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
                    <td className={styles.amount}>{formatCurrency(transaction.amount)}</td>
                    <td>{transaction.description}</td>
                    <td>{formatCurrency(transaction.balanceAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noData}>No transactions available</p>
        )}
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionButtons}>
          <Link href="/customers/new">
            <Button variant="primary">+ Add Customer</Button>
          </Link>
          <Link href="/accounts/new">
            <Button variant="primary">+ Create Account</Button>
          </Link>
          <Link href="/transactions/new">
            <Button variant="primary">+ New Transaction</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
