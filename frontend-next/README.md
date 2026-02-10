# Mini Banking App - Next.js Frontend

A modern banking application frontend built with Next.js 15, React, TypeScript, and SASS.

## 🚀 Features

- **Dashboard**: Overview of customers, accounts, and recent transactions
- **Customer Management**: Create, view, and manage customer information
- **Account Management**: Create accounts linked to customers, view balances
- **Transaction Management**: Create deposits, withdrawals, and transfers
- **Modern UI**: Clean, responsive design with SASS styling
- **Type Safety**: Full TypeScript support
- **Currency Formatting**: Proper thousand separators ($100,000.00)

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:5205

## 🛠️ Installation

1. Navigate to the project directory:
```bash
cd frontend-next
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5205
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend-next/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Dashboard
│   │   ├── customers/           # Customer pages
│   │   ├── accounts/            # Account pages
│   │   └── transactions/        # Transaction pages
│   ├── components/
│   │   ├── layout/              # Layout components (Sidebar, Header)
│   │   └── shared/              # Shared components (Button, Card, Loading)
│   └── lib/
│       ├── models/              # TypeScript interfaces
│       ├── services/            # API service classes
│       └── utils/               # Utility functions (formatters)
├── public/                       # Static assets
└── package.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: SASS Modules
- **UI**: Custom components with responsive design
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js App Router with dynamic routes
- **API**: Fetch API with service layer pattern

## 🔧 Key Features Implementation

### Currency Formatting
Uses `Intl.NumberFormat` for proper currency display:
```typescript
formatCurrency(100000) // Returns "$100,000.00"
```

### Service Layer
Clean separation with service classes:
- `AccountService`
- `CustomerService`
- `TransactionService`
- `ApiService` (base class)

### Type Safety
Full TypeScript support with interfaces for:
- Account, CreateAccount
- Customer, CreateCustomer
- Transaction, CreateTransaction, TransactionType

### Responsive Design
Mobile-friendly with:
- Flexible grid layouts
- Overflow handling for tables
- Touch-friendly buttons

## 🔗 API Endpoints

The app connects to these backend endpoints:
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer details
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts/{id}` - Get account details
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/account/{accountId}` - Get account transactions

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint (if configured)

## 🎯 Usage

1. **Start the backend API** (must be running on port 5205)
2. **Start the frontend**: `npm run dev`
3. **Navigate to** `http://localhost:3000`
4. **Create a customer** → **Create an account** → **Make transactions**

## 🌟 Highlights

- ✅ Modern Next.js 15 with App Router
- ✅ Full TypeScript support
- ✅ SASS modules for scoped styling
- ✅ Proper currency formatting with thousand separators
- ✅ Service layer architecture
- ✅ Clean component structure
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Dynamic routing
- ✅ Query parameters support

## 📦 Dependencies

- `next`: ^16.1.6
- `react`: ^19.x
- `react-dom`: ^19.x
- `sass`: ^1.x
- `typescript`: ^5.x

## 🤝 Integration with Backend

Ensure your .NET backend is configured with:
- CORS enabled for `http://localhost:3000`
- Running on `http://localhost:5205`
- All API endpoints available

## 📄 License

This project is part of the Mini Banking Application.
