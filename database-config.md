# Konfigurasi Database untuk Anak Hebat

## 1. Buat file `.env` di root project

```env
# Database Configuration
# Untuk PostgreSQL (Rekomendasi)
DATABASE_URL="postgresql://username:password@localhost:5432/anak_hebat_db"

# Untuk MySQL
# DATABASE_URL="mysql://username:password@localhost:3306/anak_hebat_db"

# Untuk SQLite (Development)
# DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3001"
```

## 2. Opsi Database

### A. PostgreSQL (Rekomendasi)
- **Supabase**: https://supabase.com (Free tier)
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Railway**: https://railway.app (Free tier)

### B. MySQL
- **PlanetScale**: https://planetscale.com (Free tier)
- **Railway**: https://railway.app

### C. SQLite (Development)
- Tidak perlu setup server
- Database file lokal

## 3. Langkah Setup

1. Pilih database provider
2. Buat database baru
3. Copy connection string ke `.env`
4. Jalankan migration: `npx prisma migrate dev`
5. Seed data: `npx prisma db seed`
