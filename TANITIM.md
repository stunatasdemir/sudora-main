# 🏺 SUDORA - B2B Dekorasyon Vitrin Sitesi

## 📋 Genel Bakış

Sudora, dekorasyon ürünlerinin B2B satışı için geliştirilmiş modern bir vitrin sitesidir. Site, potansiyel müşterilere ürünleri tanıtmak, iletişim kurmak ve admin paneli üzerinden ürün yönetimi yapmak için tasarlanmıştır.

---

## 🌐 Site Akışı ve Kullanıcı Deneyimi

### 🏠 **Ana Sayfa (Index)**
- **Hero Section**: Etkileyici görsel ve marka tanıtımı
- **Kategori Vitrini**: Ürün kategorilerinin görsel sunumu
- **Öne Çıkan Ürünler**: Admin tarafından seçilen özel ürünler
- **İletişim CTA**: Hızlı iletişim bağlantıları

### 📦 **Ürünler Sayfası**
- **Kategori Filtreleme**: Dinamik kategori bazlı filtreleme
- **Arama Fonksiyonu**: Ürün adı ve açıklamalarında arama
- **Grid Layout**: Responsive ürün kartları
- **Sonsuz Scroll**: Performanslı sayfalama

### 🔍 **Ürün Detay Sayfası**
- **Medya Galerisi**: Fotoğraf ve video desteği
- **Zoom Özelliği**: Görsel büyütme ve hareket ettirme
- **Video Oynatıcı**: Tam kontrollü video oynatma
- **Varyasyon Sistemi**: Renk, boyut gibi seçenekler
- **Detaylı Bilgiler**: Malzeme, boyut, açıklama
- **İletişim Butonu**: Direkt WhatsApp bağlantısı

### 📞 **İletişim Sayfası**
- **İletişim Formu**: Veritabanına kayıt edilen mesajlar
- **Harita Entegrasyonu**: Google Maps konum
- **Sosyal Medya**: Instagram, WhatsApp bağlantıları
- **İletişim Bilgileri**: Adres, telefon, e-posta

### ℹ️ **Hakkımızda Sayfası**
- **Şirket Hikayesi**: Marka tanıtımı
- **Değerler ve Misyon**: Şirket felsefesi
- **Ekip Tanıtımı**: Çalışan profilleri

---

## 🔐 Admin Panel Özellikleri

### 🚪 **Giriş Sistemi**
- **Güvenli URL**: `/solstageyazilimsudora` (gizli admin girişi)
- **JWT Authentication**: Token tabanlı güvenlik
- **Hesap Kilitleme**: Başarısız giriş denemelerinde otomatik kilitleme
- **Refresh Token**: Otomatik oturum yenileme
- **Rate Limiting**: Brute force saldırı koruması

### 📊 **Dashboard**
- **İstatistikler**: 
  - Toplam ürün sayısı
  - Aktif ürün sayısı
  - Öne çıkan ürün sayısı
  - Kategori sayısı
- **Hızlı Erişim**: Ürün ekleme, kategori yönetimi
- **Son Aktiviteler**: Sistem günlükleri

### 🛍️ **Ürün Yönetimi**
- **CRUD İşlemleri**: Oluştur, Oku, Güncelle, Sil
- **Medya Yönetimi**: 
  - Çoklu fotoğraf/video yükleme
  - Drag & drop sıralama
  - Otomatik boyutlandırma
  - Format dönüştürme (WebP)
- **Varyasyon Sistemi**: 
  - Renk seçenekleri
  - Boyut alternatifleri
  - Stok takibi
- **SEO Optimizasyonu**: Meta açıklamalar, URL slug
- **Öne Çıkarma**: Featured ürün işaretleme
- **Kategori Atama**: Çoklu kategori desteği
- **Durum Yönetimi**: Aktif/Pasif durumu

### 📂 **Kategori Yönetimi**
- **Hiyerarşik Yapı**: Ana ve alt kategoriler
- **Görsel Yönetimi**: Kategori görselleri
- **SEO Dostu**: URL slug otomatik oluşturma
- **Sıralama**: Drag & drop ile sıralama

### 💬 **Mesaj Yönetimi**
- **İletişim Formları**: Gelen mesajları görüntüleme
- **Durum Takibi**: Okundu/Okunmadı işaretleme
- **Öncelik Sistemi**: Düşük, Normal, Yüksek, Acil
- **Yanıtlama**: E-posta entegrasyonu
- **Filtreleme**: Tarih, durum, öncelik bazlı

### 👥 **Kullanıcı Yönetimi**
- **Admin Rolleri**: Admin, Super Admin
- **Yetki Kontrolü**: Sayfa bazlı erişim kontrolü
- **Profil Yönetimi**: Bilgi güncelleme
- **Şifre Değiştirme**: Güvenli şifre güncelleme
- **Oturum Yönetimi**: Aktif oturumları görme/sonlandırma

---

## 🛡️ Güvenlik Özellikleri

### 🔒 **Kimlik Doğrulama**
- **JWT Token**: Stateless authentication
- **Refresh Token**: Güvenli oturum yenileme
- **Password Hashing**: bcrypt ile şifreleme
- **Account Lockout**: Başarısız girişlerde kilitleme
- **Session Management**: Çoklu oturum kontrolü

### 🚫 **Rate Limiting**
- **API Endpoints**: İstek sınırlaması
- **Login Attempts**: Giriş denemesi sınırı
- **Admin Actions**: Admin işlem sınırı
- **Public Routes**: Genel erişim sınırı

### 🛡️ **Medya Koruması**
- **Sağ Tık Engelleme**: Görsel koruma
- **Drag & Drop Engelleme**: İndirme koruması
- **Developer Tools**: F12 engelleme
- **Print Engelleme**: Yazdırma koruması
- **Watermark**: Görsel damgalama (opsiyonel)

### 🔐 **Veri Güvenliği**
- **Input Validation**: Giriş verisi doğrulama
- **SQL Injection**: MongoDB injection koruması
- **XSS Protection**: Cross-site scripting koruması
- **CORS Policy**: Cross-origin istek kontrolü
- **Helmet.js**: HTTP header güvenliği

### 📁 **Dosya Güvenliği**
- **File Type Validation**: Dosya türü kontrolü
- **Size Limits**: Dosya boyutu sınırı
- **Virus Scanning**: Zararlı dosya kontrolü
- **Secure Upload**: Güvenli dosya yükleme
- **Path Traversal**: Dizin geçiş koruması

---

## 🏗️ Teknik Altyapı

### 🎨 **Frontend**
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Hızlı build tool
- **Tailwind CSS**: Utility-first CSS
- **Shadcn/ui**: Modern component library
- **React Query**: Server state management
- **React Router**: Client-side routing

### ⚙️ **Backend**
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **Sharp**: Image processing

### 🗄️ **Veritabanı Yapısı**
- **Products**: Ürün bilgileri ve medya
- **Categories**: Kategori hiyerarşisi
- **Messages**: İletişim form mesajları
- **Admins**: Admin kullanıcı bilgileri
- **Sales**: Satış kayıtları (gelecek özellik)

### 🚀 **Deployment**
- **Frontend**: Vercel/Netlify ready
- **Backend**: Railway/Heroku compatible
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary/AWS S3 ready
- **SSL**: HTTPS zorunlu

---

## 📱 Responsive Tasarım

### 📱 **Mobile First**
- **Responsive Grid**: Tüm ekran boyutları
- **Touch Optimized**: Dokunmatik arayüz
- **Fast Loading**: Optimize edilmiş performans
- **PWA Ready**: Progressive Web App desteği

### 💻 **Desktop Experience**
- **Advanced Interactions**: Hover efektleri
- **Keyboard Navigation**: Erişilebilirlik
- **Multi-column Layouts**: Geniş ekran optimizasyonu

---

## 🔧 Kurulum ve Çalıştırma

### 📋 **Gereksinimler**
- Node.js 18+
- MongoDB 5.0+
- npm/yarn

### 🚀 **Hızlı Başlangıç**
```bash
# Repository klonlama
git clone [repository-url]

# Frontend kurulum
cd frontend
npm install
npm run dev

# Backend kurulum
cd backend
npm install
npm run dev
```

### 🔑 **Admin Giriş Bilgileri**
- **URL**: `/solstageyazilimsudora`
- **Kullanıcı Adı**: admin
- **Şifre**: [güvenli şifre]

---

## 📈 Gelecek Özellikler

### 🛒 **E-ticaret Entegrasyonu**
- Online sipariş sistemi
- Ödeme gateway entegrasyonu
- Stok takip sistemi
- Kargo entegrasyonu

### 📊 **Analytics**
- Google Analytics entegrasyonu
- Kullanıcı davranış analizi
- Satış raporları
- SEO performans takibi

### 🤖 **Otomasyon**
- E-posta pazarlama
- Otomatik bildirimler
- Stok uyarıları
- Backup sistemleri

---

## 🎯 Kullanım Senaryoları

### � **Ziyaretçi Akışı**
1. **Ana Sayfa**: Marka tanıtımı ve öne çıkan ürünler
2. **Ürün Keşfi**: Kategoriler veya arama ile ürün bulma
3. **Detay İnceleme**: Ürün fotoğraf/video inceleme
4. **İletişim**: WhatsApp veya form ile iletişim kurma

### 👨‍💼 **Admin Akışı**
1. **Güvenli Giriş**: Gizli URL ile admin paneline erişim
2. **Dashboard**: Genel durum ve istatistikleri görme
3. **Ürün Yönetimi**: Yeni ürün ekleme, mevcut ürünleri düzenleme
4. **Medya Yönetimi**: Fotoğraf/video yükleme ve düzenleme
5. **Mesaj Takibi**: Gelen mesajları okuma ve yanıtlama

---

## 🔍 SEO ve Performans

### 🚀 **Performans Optimizasyonları**
- **Lazy Loading**: Görsellerin gecikmeli yüklenmesi
- **Image Optimization**: WebP format dönüştürme
- **Code Splitting**: JavaScript parçalama
- **Caching**: Browser ve server cache
- **Minification**: CSS/JS sıkıştırma

### 📈 **SEO Özellikleri**
- **Meta Tags**: Dinamik meta açıklamalar
- **Open Graph**: Sosyal medya paylaşım optimizasyonu
- **Structured Data**: Schema.org işaretleme
- **Sitemap**: Otomatik sitemap oluşturma
- **Robots.txt**: Arama motoru yönlendirme

---

## 🔧 API Dokümantasyonu

### 🌐 **Public Endpoints**
```
GET /api/products - Ürün listesi
GET /api/products/:id - Ürün detayı
GET /api/products/featured - Öne çıkan ürünler
GET /api/categories - Kategori listesi
POST /api/messages - Mesaj gönderme
```

### 🔐 **Protected Endpoints (Admin)**
```
POST /api/auth/login - Admin girişi
POST /api/auth/refresh - Token yenileme
POST /api/auth/logout - Çıkış yapma

POST /api/products - Ürün oluşturma
PUT /api/products/:id - Ürün güncelleme
DELETE /api/products/:id - Ürün silme

POST /api/upload - Dosya yükleme
DELETE /api/upload/:filename - Dosya silme

GET /api/messages - Mesaj listesi
PATCH /api/messages/:id/read - Mesaj okundu işaretleme
```

---

## 🛠️ Bakım ve Güncelleme

### 📅 **Düzenli Bakım**
- **Veritabanı Backup**: Günlük otomatik yedekleme
- **Log Monitoring**: Hata ve performans takibi
- **Security Updates**: Güvenlik yamalarının uygulanması
- **Performance Monitoring**: Site hızı ve uptime takibi

### 🔄 **Güncelleme Süreci**
1. **Staging Environment**: Test ortamında güncelleme
2. **Backup Creation**: Mevcut verinin yedeklenmesi
3. **Deployment**: Canlı ortama aktarım
4. **Verification**: Fonksiyonalite kontrolü
5. **Rollback Plan**: Geri alma planı

---

## 📊 Monitoring ve Analytics

### 📈 **Performans Metrikleri**
- **Page Load Time**: Sayfa yüklenme süreleri
- **Core Web Vitals**: Google performans metrikleri
- **Error Rates**: Hata oranları
- **API Response Times**: API yanıt süreleri

### 👥 **Kullanıcı Analytics**
- **Visitor Count**: Ziyaretçi sayısı
- **Page Views**: Sayfa görüntülenme
- **Bounce Rate**: Çıkış oranı
- **Conversion Rate**: Dönüşüm oranı

---

## 🔐 Güvenlik Kontrol Listesi

### ✅ **Uygulanan Güvenlik Önlemleri**
- [x] JWT Authentication
- [x] Password Hashing (bcrypt)
- [x] Rate Limiting
- [x] Input Validation
- [x] CORS Configuration
- [x] Helmet Security Headers
- [x] File Upload Validation
- [x] SQL Injection Protection
- [x] XSS Protection
- [x] Media Protection

### 🔍 **Düzenli Güvenlik Kontrolleri**
- [ ] Dependency Updates
- [ ] Vulnerability Scanning
- [ ] Penetration Testing
- [ ] SSL Certificate Renewal
- [ ] Backup Verification

---

## 📞 Destek ve İletişim

Bu dokümantasyon, Sudora sitesinin tüm özelliklerini ve kullanım şekillerini kapsamaktadır. Herhangi bir sorunuz için lütfen iletişime geçin.

**Proje**: Sudora B2B Dekorasyon Vitrin Sitesi
**Teknoloji Stack**: React + Node.js + MongoDB
**Versiyon**: 1.0.0
**Son Güncelleme**: 2025-01-03

### 🆘 **Acil Durum İletişim**
- **Teknik Sorunlar**: [Teknik Destek]
- **Güvenlik Sorunları**: [Güvenlik Ekibi]
- **İş Sorunları**: [Proje Yöneticisi]

---

## 📋 Ek Notlar

### ⚠️ **Önemli Uyarılar**
- Admin panel URL'si gizli tutulmalıdır
- Düzenli backup alınmalıdır
- Güvenlik güncellemeleri takip edilmelidir
- SSL sertifikası sürekli aktif olmalıdır

### 💡 **Öneriler**
- Düzenli performans testleri yapılmalıdır
- Kullanıcı geri bildirimları değerlendirilmelidir
- SEO optimizasyonları sürekli iyileştirilmelidir
- Yeni teknolojiler takip edilmelidir
