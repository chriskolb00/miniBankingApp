# Pre-Commit Checklist for Banking Frontend

## ✅ Essential Steps Before Committing to GitHub

### 1. Check .gitignore
- ✅ `.gitignore` file exists
- ✅ Ignores `node_modules/`
- ✅ Ignores `dist/` and build outputs
- ✅ Ignores `.env` files (if you have sensitive data)

### 2. Remove Sensitive Information
Check these files for sensitive data:
- [ ] `src/environments/environment.ts` - Make sure no API keys or secrets
- [ ] `src/environments/environment.development.ts` - Same check
- [ ] No `.env` files with secrets

**Current setup**: ✅ Your environment files only have `http://localhost:5205/api` which is fine for development

### 3. Verify Build Works
```bash
cd /Users/christiankolb/Documents/dev/dotnet/banking-frontend
npm run build
```
Expected: Build should succeed without errors ✅ (Already verified)

### 4. Clean Up (Optional but Recommended)
```bash
# Remove unnecessary files
rm -rf node_modules/.cache
rm -rf .angular/cache
```

### 5. Check What Will Be Committed
```bash
git status
```

**Files that SHOULD be committed:**
- ✅ All `.ts`, `.html`, `.scss` files
- ✅ `package.json` and `package-lock.json`
- ✅ `angular.json`, `tsconfig.json`
- ✅ `README.md`
- ✅ `.gitignore`
- ✅ `src/` directory with all source code

**Files that SHOULD NOT be committed:**
- ❌ `node_modules/` directory (too large, dependencies are in package.json)
- ❌ `dist/` directory (build output)
- ❌ `.angular/` directory (cache)
- ❌ `.env` files (if they contain secrets)
- ❌ IDE-specific files like `.vscode/` (unless you want to share settings)

### 6. Test the Application
```bash
# Start the dev server
ng serve

# Or on port 4201 if 4200 is busy
ng serve --port 4201
```
- [ ] Dashboard loads without errors
- [ ] Can navigate between pages
- [ ] API calls work (with backend running)

---

## 📝 Git Commands to Push to GitHub

### First Time Setup (if not already initialized)

```bash
# Navigate to your frontend directory
cd /Users/christiankolb/Documents/dev/dotnet/banking-frontend

# Initialize git (if not done already)
git init

# Add all files
git add .

# Check what's being added
git status

# Create initial commit
git commit -m "Initial commit: Angular frontend for Mini Banking System"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/banking-frontend.git

# Push to GitHub
git push -u origin main
```

### If You Already Have a Git Repo

```bash
# Check current status
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "feat: Complete Angular frontend implementation

- Dashboard with summary cards and recent transactions
- Customer management (CRUD operations)
- Account management with auto-generated account numbers
- Transaction management (Deposit, Withdrawal, Transfer)
- Responsive design with modern UI
- Loading spinner and toast notifications
- Integration with .NET API backend"

# Push to GitHub
git push
```

---

## 🔒 Security Checklist

Before pushing, verify:

- [ ] **No API Keys**: Check environment files
- [ ] **No Passwords**: No hardcoded credentials
- [ ] **No Personal Data**: No real customer/account data in code
- [ ] **No Database Connections**: Only API URLs (which is fine)

**Current Status**: ✅ Your code is safe - only has `http://localhost:5205/api`

---

## 📦 Recommended: Add a .npmrc (Optional)

If you want to control npm behavior:

```bash
# Create .npmrc file
echo "save-exact=true" > .npmrc
echo "legacy-peer-deps=false" >> .npmrc
```

---

## 📚 Update Your README

Your README.md is already comprehensive! But you might want to add:

```markdown
## GitHub Repository
https://github.com/YOUR_USERNAME/banking-frontend

## Related Repository
Backend API: https://github.com/YOUR_USERNAME/sampleDemoApi
```

---

## 🚀 Quick Commands (Copy-Paste Ready)

### Clean and Verify Before Commit
```bash
cd /Users/christiankolb/Documents/dev/dotnet/banking-frontend
npm run build
git status
```

### Commit and Push
```bash
git add .
git commit -m "feat: Complete Angular banking frontend application"
git push
```

---

## ⚠️ Common Mistakes to Avoid

1. **❌ Committing node_modules**
   - Check: `git status | grep node_modules`
   - Should show nothing if .gitignore is working

2. **❌ Committing build output**
   - Check: `git status | grep dist`
   - Should show nothing

3. **❌ Committing cache files**
   - Check: `git status | grep .angular`
   - Should show nothing

4. **❌ Large files**
   - Avoid committing files > 50MB
   - GitHub has a 100MB limit per file

5. **❌ Binary files**
   - Avoid committing database files, compiled binaries

---

## 📊 Verify Your .gitignore is Working

```bash
# This should NOT show node_modules, dist, or .angular
git status
```

If you see these directories, your .gitignore isn't working. Fix with:
```bash
git rm -r --cached node_modules
git rm -r --cached dist
git rm -r --cached .angular
git commit -m "Remove ignored files from tracking"
```

---

## ✨ Bonus: Branch Strategy (Optional)

If you want to use branches:

```bash
# Create a development branch
git checkout -b develop

# Work on features
git checkout -b feature/new-dashboard

# When done, merge back
git checkout develop
git merge feature/new-dashboard
git push
```

---

## 🎯 You're Ready When:

- ✅ `.gitignore` is properly configured
- ✅ Build succeeds without errors
- ✅ No sensitive data in code
- ✅ `git status` shows only the files you want
- ✅ Application runs successfully
- ✅ README is up to date

**Status**: Your project is READY to push to GitHub! 🚀
