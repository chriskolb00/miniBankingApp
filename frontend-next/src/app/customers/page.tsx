'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import Loading from '@/components/shared/Loading';
import { CustomerService } from '@/lib/services/customer.service';
import { Customer } from '@/lib/models/customer.model';
import { formatDate } from '@/lib/utils/formatters';
import styles from './page.module.scss';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      const data = await CustomerService.getAll();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading customers..." />;
  }

  return (
    <div className={styles.customersPage}>
      <div className={styles.header}>
        <h1>Customers</h1>
        <Link href="/customers/new">
          <Button variant="primary">+ Add Customer</Button>
        </Link>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredCustomers.length > 0 ? (
        <div className={styles.customersTable}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Member Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{formatDate(customer.dateOfBirth)}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td>
                    <Link href={`/customers/${customer.id}`}>
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
          <p>No customers found</p>
          <Link href="/customers/new">
            <Button variant="primary">Add Your First Customer</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

