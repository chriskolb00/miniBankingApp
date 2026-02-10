'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import { AccountService } from '@/lib/services/account.service';
import { Account } from '@/lib/models/account.model';
import { formatCurrency } from '@/lib/utils/formatters';
import styles from './page.module.scss';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = accounts.filter(
        (account) =>
          account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [searchTerm, accounts]);

  const loadAccounts = async () => {
    try {
      const data = await AccountService.getAll();
      setAccounts(data);
      setFilteredAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading accounts..." />;
  }

  return (
    <div className={styles.accountsPage}>
      <div className={styles.header}>
        <h1>Accounts</h1>
        <Link href="/accounts/new">
          <Button variant="primary">+ Create Account</Button>
        </Link>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search accounts by number or owner name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredAccounts.length > 0 ? (
        <div className={styles.accountsTable}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Account Number</th>
                <th>Owner Name</th>
                <th>Customer ID</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.ownerName}</td>
                  <td>
                    <Link href={`/customers/${account.customerId}`}>{account.customerId}</Link>
                  </td>
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
          <p>No accounts found</p>
          <Link href="/accounts/new">
            <Button variant="primary">Create Your First Account</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

