'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? styles.active : '';
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>🏦 Mini Banking</h2>
      </div>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
          <span className={styles.icon}>📊</span>
          <span>Dashboard</span>
        </Link>
        <Link href="/customers" className={`${styles.navItem} ${isActive('/customers')}`}>
          <span className={styles.icon}>👥</span>
          <span>Customers</span>
        </Link>
        <Link href="/accounts" className={`${styles.navItem} ${isActive('/accounts')}`}>
          <span className={styles.icon}>💳</span>
          <span>Accounts</span>
        </Link>
        <Link href="/transactions" className={`${styles.navItem} ${isActive('/transactions')}`}>
          <span className={styles.icon}>💸</span>
          <span>Transactions</span>
        </Link>
      </nav>
    </aside>
  );
}

