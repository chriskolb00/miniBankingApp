# Connecting .NET Backend to Supabase PostgreSQL

## Overview
This guide walks you through connecting your .NET mini banking API to Supabase PostgreSQL for production use, while keeping SQLite for local development.

## Step 1: Set Up Supabase

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up/login
   - Click "New Project"

2. **Create a New Project**
   - Organization: Choose or create one
   - Name: `mini-banking-api`
   - Database Password: **Save this!** (you'll need it)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait ~2 minutes for provisioning

3. **Get Your Connection String**
   - Go to **Project Settings** (gear icon)
   - Click **Database** in left sidebar
   - Find "Connection string" section
   - Select **"URI"** tab
   - Copy the connection string (looks like):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
   - **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

## Step 2: Update .NET Project (DONE ✅)

The following changes have already been made:

### 2.1 Added PostgreSQL Package
Added to `SampeDemoApi.csproj`:
```xml
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="10.0.2" />
```

### 2.2 Updated Program.cs
Modified database configuration to support both SQLite and PostgreSQL:
- **Local Development**: Uses SQLite (`mini-bank.db`)
- **Production**: Uses PostgreSQL (from connection string)

### 2.3 Updated appsettings.json
Added `ConnectionStrings` section (currently empty for local dev)

## Step 3: Configure Local Development (Optional)

If you want to test PostgreSQL locally before deploying:

1. Create `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Debug"
    }
  }
}
```

Keep the connection string empty to use SQLite for local development.

## Step 4: Set Up Production Environment Variable

When you deploy your .NET backend, set this environment variable:

**For Azure, Railway, Render, or Docker:**
```bash
ConnectionStrings__DefaultConnection="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

**Note**: Use double underscore `__` for nested configuration (ConnectionStrings__DefaultConnection)

## Step 5: Run Database Migrations on PostgreSQL

Once you have your Supabase connection string, run migrations:

```bash
cd /Users/christiankolb/Documents/dev/dotnet/sampleDemoApi

# Set the connection string temporarily for migration
export ConnectionStrings__DefaultConnection="your-supabase-connection-string-here"

# Run migrations to create tables in PostgreSQL
dotnet ef database update
```

This will create all your tables (Customers, Accounts, Transactions) in Supabase PostgreSQL.

## Step 6: Deploy Your .NET Backend

You have several options for hosting:

### Option A: Azure App Service (Recommended for .NET)
1. Create Azure account (free tier available)
2. Create App Service
3. Deploy from GitHub or VS Code
4. Set connection string in Configuration settings

### Option B: Railway
1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub
4. Add PostgreSQL database (Railway provides one)
5. Set connection string environment variable

### Option C: Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### Option D: Docker + Any Cloud
1. Create Dockerfile
2. Deploy to any cloud (AWS, GCP, DigitalOcean)

## Step 7: Update Frontend to Use Production API

Once your backend is deployed, update your Angular frontend's environment:

**In Vercel Dashboard** → Your Project → Settings → Environment Variables:
- Key: `API_URL`
- Value: `https://your-backend-url.com/api`

Then update `frontend-ng/src/environments/environment.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'http://localhost:5205/api'
};
```

## Testing Locally with Supabase (Optional)

If you want to test PostgreSQL connection locally first:

1. **Set environment variable** (temporary, this session only):
```bash
export ConnectionStrings__DefaultConnection="your-supabase-connection-string"
```

2. **Run migrations**:
```bash
dotnet ef database update
```

3. **Run the API**:
```bash
dotnet run
```

4. **Verify** it connects to Supabase by checking the Supabase dashboard → Table Editor

## Connection String Format

**Supabase provides two types:**
1. **Session Pooler** (recommended for serverless):
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

2. **Direct Connection**:
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

Use the **Session Pooler** for better performance with serverless deployments.

## Security Notes

⚠️ **NEVER commit your connection string to git!**
- Keep it in environment variables only
- Use `.gitignore` to exclude any local config files with secrets
- On Vercel/Azure/Railway, set it in their dashboard

## Common Issues

### Issue 1: SSL Required
If you get SSL errors, modify your connection string:
```
postgresql://...?sslmode=require
```

### Issue 2: Migration Errors
If migrations fail, you might need to manually create the database first in Supabase SQL Editor.

### Issue 3: Connection Timeout
Use the Session Pooler connection string (port 6543) instead of direct connection (port 5432).

## Current Status

✅ PostgreSQL package added to .NET project
✅ Program.cs updated with environment-based database selection
✅ appsettings.json configured for connection strings
⏳ Next: Get Supabase connection string
⏳ Next: Run migrations on PostgreSQL
⏳ Next: Deploy .NET backend
⏳ Next: Update frontend API URL

## Quick Commands Reference

```bash
# Restore packages
dotnet restore

# Run migrations
dotnet ef database update

# Run locally
dotnet run

# Build for deployment
dotnet publish -c Release -o ./publish
```

## Need Help?

If you run into issues:
1. Check Supabase dashboard → Table Editor to see if tables were created
2. Check connection string format (especially password and SSL mode)
3. Verify your IP is allowed (Supabase usually allows all by default)
4. Check logs in your deployment platform
