# Anak Hebat - Platform Pendidikan Anak

Platform edukasi terpadu untuk mendukung perkembangan anak dengan kolaborasi orang tua, terapis, dan psikolog.

## 🚀 Fitur Utama

### 👨‍💼 Admin Dashboard
- Manajemen pengguna (orang tua, terapis, psikolog)
- Data siswa dan laporan gaji
- Statistik dan analisis sistem

### 👨‍👩‍👧‍👦 Parent Dashboard
- Pantau perkembangan anak
- Lihat tugas rumah dari terapis
- Jadwal terapi dan pencapaian

### 🏥 Therapist Dashboard
- Laporan sesi terapi
- Pemberian tugas rumah
- Progress siswa

### 🧠 Psychologist Dashboard
- Review laporan terapi
- Analisis perkembangan siswa
- Kesimpulan dan rekomendasi

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 14 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MySQL (akan diintegrasikan)
- **Authentication**: NextAuth.js (mocked)
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📱 Mobile-First Design

- Responsive design yang berubah menjadi mobile app-like experience
- Bottom navigation untuk mobile
- Touch-friendly interactions
- Swipe gestures dan bottom sheets

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd anak-hebat
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser

## 🔐 Demo Credentials

### Admin
- Email: `admin@anakhebat.com`
- Password: `password`

### Parent
- Email: `sari.parent@email.com`
- Password: `password`

### Therapist
- Email: `dr.budi@anakhebat.com`
- Password: `password`

### Psychologist
- Email: `dr.ani@anakhebat.com`
- Password: `password`

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management
│   │   ├── sessions/      # Therapy sessions
│   │   ├── homework/      # Homework management
│   │   └── reports/       # Report management
│   ├── admin/             # Admin dashboard
│   ├── parent/            # Parent dashboard
│   ├── therapist/         # Therapist dashboard
│   ├── psychologist/      # Psychologist dashboard
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── data/                 # Mock data
├── hooks/                # Custom hooks
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## 🎨 Design System

### Colors
- Primary: Pink to Purple gradient
- Secondary: Blue, Green, Orange accents
- Background: Light gray tones

### Typography
- Font: Geist (Sans & Mono)
- Responsive text sizing

### Components
- Cards dengan shadow dan rounded corners
- Gradient backgrounds
- Interactive hover states
- Mobile-optimized buttons

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get users with filters
- `POST /api/users` - Create new user

### Sessions
- `GET /api/sessions` - Get therapy sessions
- `POST /api/sessions` - Create new session

### Homework
- `GET /api/homework` - Get homework assignments
- `POST /api/homework` - Create new homework
- `PATCH /api/homework` - Update homework status

### Reports
- `GET /api/reports` - Get therapy reports
- `POST /api/reports` - Create new report
- `PATCH /api/reports` - Update report

## 📱 Mobile Features

### Navigation
- Bottom navigation bar pada mobile
- Sidebar yang collapse ke hamburger menu
- Touch-friendly button sizes

### Interactions
- Swipe gestures untuk actions
- Pull-to-refresh functionality
- Bottom sheets untuk forms
- Floating action buttons

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Flexible grid layouts

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic UI/UX implementation
- ✅ Mock data and interactions
- ✅ Mobile-responsive design
- ✅ Role-based dashboards

### Phase 2 (Next)
- 🔄 Database integration (MySQL)
- 🔄 Real authentication (NextAuth.js)
- 🔄 File upload functionality
- 🔄 Real-time notifications

### Phase 3 (Future)
- 📋 Advanced analytics
- 📋 Mobile app (React Native)
- 📋 Video conferencing
- 📋 AI-powered insights

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Anak Hebat Team
- **Design**: Mobile-first, child-friendly interface
- **Architecture**: Full-stack Next.js application

## 📞 Support

Untuk pertanyaan atau dukungan, silakan hubungi tim pengembang.

---

**Anak Hebat** - Membantu anak Indonesia tumbuh hebat! 🌟
