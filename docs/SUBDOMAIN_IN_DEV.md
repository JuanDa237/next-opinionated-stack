# Multi-Subdomain Authentication on Windows using `local.test`

This guide explains how to configure Windows so you can use:

- `http://local.test:3000`
- `http://tenant1.local.test:3000`
- `http://tenant2.local.test:3000`
- `http://<<any_subdomain>>.local.test:3000`

All sharing the same authentication session.

---

## Why This Is Needed

Browsers only allow cookies to be shared across real domain hierarchies.

That means: `*.local.test` can share cookies if the cookie domain is: `<<any_subdomain>>.local.test`

However, Windows does **not support wildcard subdomains** in the hosts file.

So each subdomain must be registered manually.

---

# Step 1 — Edit the Windows Hosts File

### 1. Open Notepad as Administrator

- Click Windows
- Search for `Notepad`
- Right-click → **Run as administrator**

### 2. Open the hosts file

- Click File
- Click Open
- Go to: `C:\Windows\System32\drivers\etc\hosts`
- Change file type filter from `Text Documents` to `All Files`
- Open `hosts` file

---

## Step 2 — Add Your Local Domains

At the bottom of the file, add:

```
# Development Domains
127.0.0.1 local.test
127.0.0.1 tenant1.local.test
127.0.0.1 tenant2.local.test
127.0.0.1 <<any_subdomain>>.local.test
# END Development Domains
```

You must manually add each subdomain you plan to use.

Save the file.

If Windows asks for permission, you must have opened Notepad as Administrator.

---

# Step 3 — Flush DNS Cache

Open PowerShell as Administrator and run:

```bash
ipconfig /flushdns
```

You should see: `Successfully flushed the DNS Resolver Cache.`

# Step 4 — Test It

- Use `.env.example` config
- Run `pnpm dev`
- Open: `http://local.test:3000/admin`
- Then Open: `http://tenant1.local.test:3000/admin`

If configured correctly:

- You remain logged in
- Session is shared
- Cookies are scoped to all local.test subdomains

# Step 5 (Optional) - Use https

- Install [Chocolatey](https://chocolatey.org/).
- Run `choco install mkcert`
- Run `mkcert -install`
- Run this inside the project root `mkcert local.test "*.local.test"`.
  It will generate something like:
  ```
  local.test+1.pem
  local.test+1-key.pem
  ```
- Run `pnpm dev:https`
