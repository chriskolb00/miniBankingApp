export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  ownerName: string;
  customerId: number;
}

export interface CreateAccount {
  accountNumber: string;
  balance: number;
  ownerName: string;
  customerId: number;
}

