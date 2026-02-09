# GitHub Account Switching Guide

## Current Configuration

**Git is now configured as:**
- Username: `ChristianShineforth`
- Email: `christian@shineforth.co`

---

## How to Switch Between GitHub Accounts

### Option 1: Switch Globally (All Projects)

#### Switch to ChristianShineforth:
```bash
git config --global user.name "ChristianShineforth"
git config --global user.email "christian@shineforth.co"
```

#### Switch to chriskolb00:
```bash
git config --global user.name "chriskolb00"
git config --global user.email "chriskolb00@users.noreply.github.com"
```

#### Clear cached credentials (do this after switching):
```bash
printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
```

Next time you push, it will ask for credentials for the new account.

---

### Option 2: Set Per-Project (Recommended for Multiple Accounts)

Use **local** config for specific projects instead of global:

#### For Mini Banking App (use chriskolb00):
```bash
cd /Users/christiankolb/Documents/dev/dotnet
git config user.name "chriskolb00"
git config user.email "chriskolb00@users.noreply.github.com"
```

#### For Other Projects (use ChristianShineforth):
```bash
cd /path/to/other/project
git config user.name "ChristianShineforth"
git config user.email "christian@shineforth.co"
```

**Benefits:**
- Global config stays as your default account
- Each project uses its own account
- No need to switch back and forth

---

### Option 3: Use SSH Keys (Advanced - Best for Multiple Accounts)

Configure different SSH keys for each account.

#### Create SSH keys:
```bash
# For ChristianShineforth
ssh-keygen -t ed25519 -C "christian@shineforth.co" -f ~/.ssh/id_ed25519_shineforth

# For chriskolb00
ssh-keygen -t ed25519 -C "chriskolb00@users.noreply.github.com" -f ~/.ssh/id_ed25519_chriskolb
```

#### Configure SSH:
Create `~/.ssh/config`:
```
# ChristianShineforth account
Host github.com-shineforth
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_shineforth

# chriskolb00 account
Host github.com-chriskolb
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_chriskolb
```

#### Add keys to GitHub:
1. Copy public key: `cat ~/.ssh/id_ed25519_shineforth.pub`
2. Go to https://github.com/settings/keys
3. Add the key

Repeat for the other account.

#### Use different hosts for different repos:
```bash
# For ChristianShineforth repo
git remote set-url origin git@github.com-shineforth:ChristianShineforth/repo.git

# For chriskolb00 repo
git remote set-url origin git@github.com-chriskolb:chriskolb00/miniBankingApp.git
```

---

## 🔍 Check Current Configuration

### Global config:
```bash
git config --global user.name
git config --global user.email
```

### Local config (in a specific project):
```bash
cd /path/to/project
git config user.name
git config user.email
```

### All config (both global and local):
```bash
git config --list
```

---

## 🔄 Quick Switch Commands

### Switch to ChristianShineforth (CURRENT):
```bash
git config --global user.name "ChristianShineforth"
git config --global user.email "christian@shineforth.co"
printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
```

### Switch to chriskolb00:
```bash
git config --global user.name "chriskolb00"
git config --global user.email "chriskolb00@users.noreply.github.com"
printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
```

---

## 💡 My Recommendation

**Use local config for this project:**

```bash
cd /Users/christiankolb/Documents/dev/dotnet

# Set chriskolb00 ONLY for this project
git config user.name "chriskolb00"
git config user.email "chriskolb00@users.noreply.github.com"

# Keep global config as ChristianShineforth
git config --global user.name "ChristianShineforth"
git config --global user.email "christian@shineforth.co"
```

This way:
- This banking app uses `chriskolb00`
- All other projects use `ChristianShineforth`
- No switching needed!

---

## ✅ Current Status

**Global config:** ChristianShineforth (default for all projects)

**To push this project as chriskolb00:**
```bash
cd /Users/christiankolb/Documents/dev/dotnet
git config user.name "chriskolb00"
git config user.email "chriskolb00@users.noreply.github.com"
git push origin main
```

Choose the account you want to use and follow the commands above! 🚀
