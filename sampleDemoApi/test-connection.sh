#!/bin/bash

# Test PostgreSQL Connection
# Run this from the sampleDemoApi folder

echo "Testing PostgreSQL connection..."
echo ""

# Load environment variables properly (using set -a to avoid shell expansion issues)
set -a
source .env
set +a

# Check if connection string is set
if [ -z "$ConnectionStrings__DefaultConnection" ]; then
    echo "❌ Error: Connection string not found in .env file"
    exit 1
fi

echo "✓ Connection string loaded from .env"
echo ""
echo "Testing database connection..."
echo ""

# Try to apply migrations (this will test the connection)
dotnet ef database update

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Connection to PostgreSQL works!"
    echo ""
    echo "Your Supabase database is now set up with:"
    echo "  - Customers table"
    echo "  - Accounts table"
    echo "  - Transactions table"
else
    echo ""
    echo "❌ Connection failed. Check your connection string in .env file"
    echo ""
    echo "Common issues:"
    echo "  - Wrong password"
    echo "  - Wrong host/port"
    echo "  - Database doesn't exist"
    echo "  - Network/firewall issues"
fi
