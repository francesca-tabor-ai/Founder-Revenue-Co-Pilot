# Admin Dashboard Credentials

## Admin Login

Use these credentials to access the admin dashboard at `/admin`:

| Field | Value |
|-------|-------|
| **URL** | `/admin` (redirects to login if not authenticated) |
| **Login URL** | `/auth/login` |
| **Email** | `admin@founderrevenue.com` |
| **Password** | `Admin123!@#` |

## Demo User (Non-Admin)

For testing regular user flow:

| Field | Value |
|-------|-------|
| **Email** | `user@example.com` |
| **Password** | `User123!@#` |

**Note:** Only users with the `ADMIN` role can access `/admin`. Non-admin users will be redirected to login.

## Setup

1. **Fix DATABASE_URL** in `.env.local` – your Railway PostgreSQL URL is missing the host. It should look like:
   ```
   postgresql://postgres:PASSWORD@HOST:5432/railway
   ```
   Get the full connection string from your Railway project dashboard.

2. **Push schema & seed:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Generate NEXTAUTH_SECRET** for production:
   ```bash
   openssl rand -base64 32
   ```

## Security

- **Change these credentials** before deploying to production
- Run `npm run db:seed` to create/reset the admin user
- Ensure `NEXTAUTH_SECRET` is set to a strong random value in production
