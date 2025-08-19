# 🗄️ Setup Database untuk Anak Hebat

## 📋 Langkah-langkah Setup Database

### 1. **Pilih Database Provider**

#### A. **Supabase (Rekomendasi - Free)**
1. Kunjungi [supabase.com](https://supabase.com)
2. Sign up dengan GitHub/Google
3. Buat project baru
4. Copy connection string dari Settings > Database

#### B. **Vercel Postgres (Jika deploy di Vercel)**
1. Di dashboard Vercel, buat Postgres database
2. Copy connection string yang diberikan

#### C. **SQLite (Development Lokal)**
- Tidak perlu setup server
- Database file lokal

### 2. **Setup Environment Variables**

Buat file `.env` di root project:

```env
# Database URL (pilih salah satu)
DATABASE_URL="postgresql://username:password@localhost:5432/anak_hebat_db"
# atau
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3001"
```

### 3. **Generate Prisma Client**

```bash
npm run db:generate
```

### 4. **Push Schema ke Database**

```bash
# Untuk development
npm run db:push

# Untuk production (dengan migration)
npm run db:migrate
```

### 5. **Seed Data Awal**

```bash
npm run db:seed
```

### 6. **Verifikasi Setup**

```bash
# Buka Prisma Studio untuk melihat data
npm run db:studio
```

## 🔧 Script Database yang Tersedia

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database (development)
npm run db:push

# Migrate database (production)
npm run db:migrate

# Seed data awal
npm run db:seed

# Buka Prisma Studio
npm run db:studio
```

## 📊 Struktur Database

### **Tables:**
- `users` - Data pengguna (admin, parent, therapist, psychologist)
- `children` - Data anak
- `sessions` - Data sesi terapi
- `homework` - Data tugas/aktivitas
- `reports` - Data laporan psikologis

### **Relationships:**
- Parent → Children (1:many)
- Child → Sessions (1:many)
- Child → Homework (1:many)
- Session → Reports (1:many)
- User → Sessions (as therapist) (1:many)
- User → Homework (as therapist) (1:many)
- User → Reports (as psychologist) (1:many)

## 🚀 Deployment

### **Vercel + Supabase**
1. Setup Supabase database
2. Copy connection string ke Vercel environment variables
3. Deploy aplikasi

### **Railway**
1. Setup PostgreSQL di Railway
2. Copy connection string ke environment variables
3. Deploy aplikasi

## 🔍 Testing API

Setelah setup database, test API endpoints:

```bash
# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sari.parent@email.com","password":"password"}'

# Test get users
curl "http://localhost:3001/api/users"

# Test get sessions
curl "http://localhost:3001/api/sessions"
```

## 🛠️ Troubleshooting

### **Error: "Database connection failed"**
- Periksa DATABASE_URL di .env
- Pastikan database server berjalan
- Periksa firewall/network

### **Error: "Table doesn't exist"**
- Jalankan `npm run db:push` atau `npm run db:migrate`
- Periksa schema.prisma

### **Error: "Prisma client not generated"**
- Jalankan `npm run db:generate`
- Restart development server

## 📝 Notes

- **Development**: Gunakan `db:push` untuk perubahan schema cepat
- **Production**: Gunakan `db:migrate` untuk version control
- **Data**: Jalankan `db:seed` setiap kali reset database
- **Monitoring**: Gunakan `db:studio` untuk melihat data
