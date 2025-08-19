# 🚀 Panduan Deployment ke Vercel

## Prerequisites
- Akun Vercel
- Database MySQL (PlanetScale, Railway, atau provider lain)
- Node.js 18+ di local

## Langkah-langkah Deployment

### 1. **Persiapkan Database**
```bash
# Gunakan salah satu provider database:
# - PlanetScale (Recommended)
# - Railway
# - Supabase
# - AWS RDS
# - DigitalOcean Managed MySQL
```

### 2. **Setup Environment Variables di Vercel**
Setelah deploy, tambahkan environment variables di Vercel Dashboard:

```env
DATABASE_URL="mysql://username:password@host:port/database_name"
JWT_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 3. **Deploy ke Vercel**

#### **Metode 1: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

#### **Metode 2: GitHub Integration**
1. Push code ke GitHub
2. Connect repository di Vercel Dashboard
3. Configure environment variables
4. Deploy

### 4. **Setup Database Schema**
Setelah deploy pertama kali:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed data (optional)
npx prisma db seed
```

### 5. **Verifikasi Deployment**
- Cek build logs di Vercel Dashboard
- Test semua fitur aplikasi
- Verifikasi koneksi database

## Troubleshooting

### Error: "Prisma Client not found"
```bash
# Pastikan postinstall script berjalan
npm run postinstall
```

### Error: "Database connection failed"
- Cek DATABASE_URL di environment variables
- Pastikan database accessible dari Vercel
- Cek firewall settings

### Error: "Build failed"
- Cek build logs di Vercel Dashboard
- Pastikan semua dependencies terinstall
- Verifikasi TypeScript errors

## Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Seed data loaded (if needed)
- [ ] All features tested
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Error monitoring setup

## Monitoring

### Vercel Analytics
- Enable di Vercel Dashboard
- Monitor performance metrics

### Database Monitoring
- Monitor connection pool
- Check query performance
- Set up alerts

## Security

### Environment Variables
- JWT_SECRET harus strong dan unique
- DATABASE_URL tidak boleh di-commit
- Gunakan Vercel's built-in secrets management

### Database Security
- Use SSL connections
- Restrict database access
- Regular backups

## Performance Optimization

### Database
- Add indexes untuk queries yang sering digunakan
- Optimize Prisma queries
- Use connection pooling

### Application
- Enable Next.js caching
- Optimize images
- Use CDN for static assets
