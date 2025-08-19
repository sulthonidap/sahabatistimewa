# 🗄️ Setup MariaDB untuk Anak Hebat

## 📋 Konfigurasi Database

### 1. **Buat file `.env` di root project**

```env
# Database Configuration
DATABASE_URL="mysql://root:@localhost:3306/ahom_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3001"
```

### 2. **Jika ada password, gunakan format ini:**

```env
DATABASE_URL="mysql://username:password@localhost:3306/ahom_db"
```

## 🔧 Langkah Setup

### 1. **Generate Prisma Client**
```bash
npm run db:generate
```

### 2. **Push Schema ke Database**
```bash
npm run db:push
```

### 3. **Seed Data Awal**
```bash
npm run db:seed
```

### 4. **Verifikasi Setup**
```bash
npm run db:studio
```

## 🛠️ Troubleshooting MariaDB

### **Error: "Access denied"**
- Pastikan user MariaDB memiliki akses ke database `ahom_db`
- Cek username dan password di connection string

### **Error: "Database doesn't exist"**
- Buat database terlebih dahulu:
```sql
CREATE DATABASE ahom_db;
```

### **Error: "Connection refused"**
- Pastikan MariaDB server berjalan
- Cek port 3306 tidak diblokir

## 📊 Struktur Database

Database `ahom_db` akan memiliki tabel:
- `users` - Data pengguna
- `children` - Data anak
- `sessions` - Data sesi terapi
- `homework` - Data tugas/aktivitas
- `reports` - Data laporan psikologis

## 🔍 Test Connection

Setelah setup, test dengan:
```bash
# Test API users
curl "http://localhost:3001/api/users"

# Test API sessions
curl "http://localhost:3001/api/sessions"
```
