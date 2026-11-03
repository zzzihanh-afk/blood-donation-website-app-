# LALBINDU — DEPLOYMENT & OPERATIONS GUIDE

## 1. Environment Configurations

All applications consume environment variables safely without exposing private secrets.

Create `.env.local` for web and `.env` for mobile based on `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # SERVER-ONLY

# Mobile Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Bangladesh SMS Gateway (Optional in Dev, Required for Live Phone OTP)
BANGLADESH_SMS_API_KEY=your_sms_api_key
BANGLADESH_SMS_SENDER_ID=LALBINDU
BANGLADESH_SMS_PROVIDER=mock_in_development # or 'ssl_wireless', 'muthofun', 'greenweb'

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 2. Database Migrations Deployment

```bash
# Apply migrations sequentially to PostgreSQL
psql "$DATABASE_URL" -f supabase/migrations/20261103000001_initial_core_schema.sql
psql "$DATABASE_URL" -f supabase/seed.sql
```

---

## 3. Web Deployment (Vercel)

The web application is configured for deployment on Vercel:
- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Build Command: `pnpm build`
- Output Directory: `.next`

---

## 4. Mobile Deployment (EAS / Expo)

```bash
cd apps/mobile
pnpm eas build --platform android --profile production
pnpm eas build --platform ios --profile production
```

---
© 2026 LalBindu Operations.
