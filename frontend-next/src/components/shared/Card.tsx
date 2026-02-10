'use client';

import Link from 'next/link';
import styles from './Card.module.scss';

interface CardProps {
  title: string;
  value: string;
  icon: string;
  href?: string;
}

export default function Card({ title, value, icon, href }: CardProps) {
  const content = (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className={styles.cardLink}>{content}</Link>;
  }

  return content;
}

