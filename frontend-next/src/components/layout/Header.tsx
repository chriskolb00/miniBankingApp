import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <h1>Banking Application</h1>
        <div className={styles.user}>
          <span>👤 Admin</span>
        </div>
      </div>
    </header>
  );
}

