import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

