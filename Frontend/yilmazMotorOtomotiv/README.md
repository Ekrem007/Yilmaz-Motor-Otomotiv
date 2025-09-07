# Yılmaz Motor Otomotiv Web Uygulaması

<div align="center">
  <img src="https://img.shields.io/badge/Angular-19.2-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js">
</div>

<div align="center">
  
  **� Dil Seçenekleri / Language Options**
  
  [![Türkçe](https://img.shields.io/badge/Türkçe-README-blue?style=for-the-badge)](README.md) 
  [![English](https://img.shields.io/badge/English-README-red?style=for-the-badge)](README.en.md)
  
</div>

---

## 📋 Proje Hakkında

Yılmaz Motor Otomotiv Web Uygulaması, otomotiv sektöründe faaliyet gösteren şirketler için geliştirilmiş modern bir e-ticaret platformudur. Angular 19 ve Asp.NET Core teknolojileri kullanılarak geliştirilmiştir.

## ✨ Özellikler

### 🛍️ Müşteri Özellikleri
- **Ürün Katalogu**: Kategoriye göre ürün listeleme ve detay sayfaları
- **Gelişmiş Filtreleme**: Fiyat aralığı, stok durumu ve indirim filtrelemeleri
- **Sepet Yönetimi**: Ürün ekleme, çıkarma ve miktar güncelleme
- **Ürün Karşılaştırma**: Birden fazla ürünü karşılaştırma özelliği
- **Arama Sistemi**: Ürün adı ve kategoriye göre arama
- **Kullanıcı Profili**: Hesap yönetimi ve sipariş geçmişi
- **İndirimli Ürünler**: Zamanlı indirim kampanyaları
- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu

### 🔐 Yönetici Özellikleri
- **Dashboard**: Satış ve stok istatistikleri
- **Ürün Yönetimi**: Ürün ekleme, düzenleme ve silme
- **Kategori Yönetimi**: Kategori CRUD işlemleri
- **Sipariş Yönetimi**: Sipariş takibi ve durum güncelleme
- **Kullanıcı Yönetimi**: Müşteri hesapları yönetimi
- **İndirim Yönetimi**: Kampanya oluşturma ve yönetme
- **Stok Takibi**: Gerçek zamanlı stok kontrolü
- **İstatistikler**: Grafik ve raporlar

### 🎫 Destek Sistemi
- **Ticket Sistemi**: Müşteri destek talepleri
- **İletişim Formu**: Doğrudan iletişim
- **Canlı Destek**: Anlık müşteri desteği

## 🚀 Teknolojiler

- **Frontend Framework**: Angular 19.2
- **Backend Framework**: Asp.NET Core 9.0
- **UI Framework**: Bootstrap 5.3
- **CSS Framework**: Angular Material 19.2
- **Grafik Kütüphanesi**: Chart.js 4.5, ng2-charts 8.0
- **HTTP İstemcisi**: Angular HTTP Client
- **Bildirim Sistemi**: ngx-toastr 19.0
- **Icon Kütüphanesi**: Bootstrap Icons
- **Server Side Rendering**: Angular SSR

## 📦 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn
- Angular CLI

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone https://github.com/Ekrem007/Yilmaz-Motor-Otomotiv.git
   cd Yilmaz-Motor-Otomotiv/Frontend/yilmazMotorOtomotiv
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm start
   # veya
   ng serve
   ```

4. **Uygulamayı görüntüleyin**
   ```
   http://localhost:4200
   ```

## 🛠️ Geliştirme

### Mevcut Komutlar

```bash
# Geliştirme sunucusu
npm start

# Production build
npm run build

# Test çalıştırma
npm run test

# Development build (watch mode)
npm run watch

# SSR sunucusu
npm run serve:ssr:yilmazMotorOtomotiv
```

### Kod Üretimi

Yeni bir component oluşturmak için:

```bash
ng generate component component-adı
```

Tüm kullanılabilir şemalar için:

```bash
ng generate --help
```

## �️ Build

Projeyi build etmek için:

```bash
ng build
```

Build dosyaları `dist/` dizininde oluşturulacaktır.

## 🧪 Test

### End-to-end testleri çalıştırma

```bash
ng e2e
```

## 🔧 Konfigürasyon

API endpoint'lerini `src/app/Services/` klasöründeki servis dosyalarından düzenleyebilirsiniz.

## 📞 İletişim

**Proje Sahibi**: Ekrem  
**GitHub**: [@Ekrem007](https://github.com/Ekrem007)  
**Repository**: [Yilmaz-Motor-Otomotiv](https://github.com/Ekrem007/Yilmaz-Motor-Otomotiv)

## 📚 Ek Kaynaklar

Angular CLI hakkında daha fazla bilgi için [Angular CLI Dokümantasyonu](https://angular.dev/tools/cli) sayfasını ziyaret edin.
