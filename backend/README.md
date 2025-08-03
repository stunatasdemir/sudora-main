# Sudora Backend API

Sudora B2B wholesale decoration showcase website için Node.js + Express + MongoDB backend API'si.

## 🚀 Özellikler

- **Ürün Yönetimi**: CRUD operasyonları, kategori filtreleme, arama
- **Kategori Yönetimi**: Dinamik kategori sistemi
- **İletişim Formu**: Mesaj gönderme ve admin yönetimi
- **Admin Paneli**: JWT tabanlı kimlik doğrulama
- **Güvenlik**: Rate limiting, CORS, helmet
- **Validation**: Express-validator ile veri doğrulama

## 🛠️ Teknoloji Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Veritabanı (MongoDB Atlas)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers

## 📦 Kurulum

1. **Dependencies'leri kur:**
```bash
npm install
```

2. **Environment variables ayarla:**
```bash
cp .env.example .env
# .env dosyasını düzenle
```

3. **Veritabanını seed et:**
```bash
npm run seed
```

4. **Development server'ı başlat:**
```bash
npm run dev
```

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
ADMIN_EMAIL=admin@sudora.com
ADMIN_PASSWORD=admin123
```

## 📚 API Endpoints

### Public Endpoints

#### Products
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Tek ürün detayı
- `GET /api/products/featured` - Öne çıkan ürünler

#### Categories
- `GET /api/categories` - Tüm kategorileri listele
- `GET /api/categories/:id` - Tek kategori detayı
- `GET /api/categories/slug/:slug` - Slug ile kategori

#### Messages
- `POST /api/messages` - İletişim formu gönder

#### Health Check
- `GET /api/health` - API durumu

### Protected Endpoints (Admin)

#### Authentication
- `POST /api/auth/login` - Admin girişi
- `POST /api/auth/refresh` - Token yenile
- `POST /api/auth/logout` - Çıkış yap
- `GET /api/auth/me` - Profil bilgisi
- `PUT /api/auth/me` - Profil güncelle

#### Products (Admin)
- `POST /api/products` - Yeni ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil
- `PATCH /api/products/:id/featured` - Öne çıkar/çıkarma

#### Categories (Admin)
- `POST /api/categories` - Yeni kategori ekle
- `PUT /api/categories/:id` - Kategori güncelle
- `DELETE /api/categories/:id` - Kategori sil
- `PATCH /api/categories/:id/toggle` - Aktif/pasif

#### Messages (Admin)
- `GET /api/messages` - Tüm mesajları listele
- `GET /api/messages/:id` - Tek mesaj detayı
- `PATCH /api/messages/:id/read` - Okundu işaretle
- `POST /api/messages/:id/reply` - Mesaja yanıt ver
- `DELETE /api/messages/:id` - Mesaj sil

## 🔐 Admin Giriş Bilgileri

**Kullanıcı Adı:** sudoraadmin
**Şifre:** 23417202001Ceyda.

## 📊 Veri Modelleri

### Product
```javascript
{
  name: String,
  description: String,
  category: String,
  imageUrl: String,
  material: String,
  dimensions: String,
  colors: [String],
  featured: Boolean,
  active: Boolean
}
```

### Category
```javascript
{
  name: String,
  description: String,
  slug: String,
  icon: String,
  active: Boolean,
  sortOrder: Number
}
```

### Message
```javascript
{
  name: String,
  email: String,
  message: String,
  read: Boolean,
  replied: Boolean,
  priority: String
}
```

### Admin
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  role: String,
  active: Boolean
}
```

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- bcrypt ile şifre hashleme
- Rate limiting (API, auth, contact form)
- CORS yapılandırması
- Helmet security headers
- Input validation
- MongoDB injection koruması

## 🚦 Rate Limits

- **API Genel**: 100 istek/15 dakika
- **Auth**: 5 istek/15 dakika
- **Contact Form**: 3 istek/saat
- **Admin**: 30 istek/dakika

## 📝 Scripts

```bash
npm start          # Production server
npm run dev        # Development server (nodemon)
npm run seed       # Veritabanını seed et
```

## 🌐 CORS Ayarları

Frontend portları:
- http://localhost:8080 (Vite dev server)
- http://localhost:3000

## 📁 Proje Yapısı

```
backend/
├── controllers/     # İş mantığı
├── middleware/      # Auth, validation, error handling
├── models/         # Mongoose şemaları
├── routes/         # API routes
├── scripts/        # Seeding ve yardımcı scriptler
├── utils/          # Yardımcı fonksiyonlar
├── server.js       # Ana server dosyası
└── package.json
```

## 🔄 Frontend Entegrasyonu

Bu backend, React + Vite + Tailwind frontend'i ile uyumlu olacak şekilde tasarlanmıştır.

**Frontend API Base URL:** `http://localhost:3000/api`

## 🐛 Hata Ayıklama

Server logları için:
```bash
npm run dev
```

MongoDB bağlantısını test etmek için:
```bash
node test-db.js
```

## 📞 Destek

Herhangi bir sorun için lütfen iletişime geçin.
