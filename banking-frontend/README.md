# Banking Frontend - Angular Application

A modern, responsive Angular frontend application for the Mini Banking System API.

## Features

- **Dashboard**: Overview of customers, accounts, and recent transactions
- **Customer Management**: Create, view, and delete customers
- **Account Management**: Create accounts and view account details
- **Transaction Management**: Create and view transactions (Deposit, Withdrawal, Transfer)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Integrates with the .NET API backend

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (installed globally)
- The sampleDemoApi backend running on `http://localhost:5205`

## Installation

1. Navigate to the project directory:
```bash
cd banking-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Server

1. Start the Angular development server:
```bash
ng serve
```

2. Open your browser and navigate to:
```
http://localhost:4200
```

The app will automatically reload when you make changes to the source files.

### Running with the Backend

**Terminal 1 - Start the API:**
```bash
cd ../sampleDemoApi
dotnet run
```
The API will run on `http://localhost:5205`

**Terminal 2 - Start the Frontend:**
```bash
cd banking-frontend
ng serve
```
The frontend will run on `http://localhost:4200`

## Building for Production

Build the project:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
banking-frontend/
├── src/
│   ├── app/
│   │   ├── core/                  # Core services, models, interceptors
│   │   │   ├── models/           # TypeScript interfaces for API data
│   │   │   ├── services/         # HTTP services for API communication
│   │   │   └── interceptors/     # HTTP interceptors (error, loading)
│   │   ├── features/             # Feature modules
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   ├── customers/        # Customer management
│   │   │   ├── accounts/         # Account management
│   │   │   └── transactions/     # Transaction management
│   │   ├── layouts/              # Layout components (header, sidebar)
│   │   ├── shared/               # Shared components and pipes
│   │   │   ├── components/       # Reusable components
│   │   │   └── pipes/            # Custom pipes
│   │   └── app.component.ts      # Root component
│   ├── environments/             # Environment configurations
│   └── styles.scss               # Global styles
└── package.json
```

## API Endpoints Used

- **Customers**: `GET /api/customers`, `POST /api/customers`, `DELETE /api/customers/{id}`
- **Accounts**: `GET /api/accounts`, `POST /api/accounts`, `GET /api/accounts/{id}`
- **Transactions**: `GET /api/transactions`, `POST /api/transactions`, `GET /api/transactions/account/{accountId}`

## Features in Detail

### Dashboard
- Total customer count
- Total account count  
- Total balance across all accounts
- Recent transactions list
- Quick action buttons

### Customer Management
- View all customers in a searchable table
- Create new customers with validation
- View customer details with associated accounts
- Delete customers

### Account Management
- View all accounts
- Create new accounts linked to customers
- Auto-generate account numbers
- View account details with transaction history
- Beautiful card-style account display

### Transaction Management
- View all transactions with filtering by type
- Create new transactions (Deposit, Withdrawal, Transfer)
- Real-time balance calculation
- Transaction validation (insufficient funds check)
- Color-coded transaction types

## Technologies Used

- **Angular 19**: Frontend framework
- **TypeScript**: Programming language
- **RxJS**: Reactive programming
- **SCSS**: Styling
- **Angular Router**: Navigation
- **HttpClient**: API communication

## Development

### Code Scaffolding

Generate a new component:
```bash
ng generate component component-name
```

Generate a new service:
```bash
ng generate service service-name
```

### Running Tests

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## Configuration

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5205/api'
};
```

## Troubleshooting

### CORS Issues
The backend API has CORS enabled. If you encounter CORS issues, ensure the API is running and the `apiUrl` in the environment file is correct.

### API Connection
If the frontend can't connect to the API:
1. Verify the API is running on `http://localhost:5205`
2. Check the API URL in `environment.ts`
3. Check browser console for errors

### Build Errors
If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
ng serve
```

## License

This project is for demonstration purposes.
