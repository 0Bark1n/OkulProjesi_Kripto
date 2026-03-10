# 📈 KriptoProje - Dijital Finans ve Kripto Cüzdan Arayüzü

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![ApexCharts](https://img.shields.io/badge/ApexCharts-00E396.svg?style=for-the-badge)

Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi, **Ön Yüz Yazılım Geliştirme** bölümü, **İleri Web Tasarımı** dersi kapsamında geliştirilmiş; modern, duyarlı (responsive) ve gerçek zamanlı veri simülasyonuna sahip bir kripto borsa terminali projesidir.

🌐 **Canlı Demo:** [Projeyi Görüntüle](https://0bark1n.github.io/OkulProjesi_Kripto/)

---

## 🚀 Öne Çıkan Özellikler

Bu proje, modern Front-End (Ön-Yüz) teknolojileri kullanılarak "Bileşen Tabanlı" (Component-based) bir mimari mantığıyla modüler olarak tasarlanmıştır.

* **Dinamik Borsa Simülasyonu:** JavaScript ile arka planda çalışan algoritma sayesinde anlık değişen Bitcoin (BTC) ve Ethereum (ETH) fiyatları.
* **İnteraktif Grafikler:** `ApexCharts` kütüphanesi entegrasyonu ile canlı fiyat akışını gösteren mum/çizgi grafikleri ve portföy dağılımını gösteren dinamik halka (donut) grafik.
* **Al/Sat Motoru (Trade Engine):** Kullanıcıların sanal bakiye ile kripto para alıp satabildiği, portföy bakiyesini ve işlem geçmişini anlık güncelleyen form yapısı.
* **Karanlık/Aydınlık Tema:** CSS CSS Variables (Değişkenler) kullanılarak sisteme entegre edilmiş, tek tıkla değişen tam uyumlu tema motoru.
* **Responsive & Akordeon Menü:** Mobil cihazlarda yatay kaydırılabilir, masaüstünde ise CSS `transition` özellikleri ile desteklenmiş açılır-kapanır (accordion) sidebar navigasyonu.
* **Modüler SCSS Mimarisi:** CSS kodları `_layout.scss`, `_components.scss` gibi modüllere ayrılarak derlenmiş, temiz kod (Clean Code) prensiplerine uyulmuştur.
* **Kusursuz SEO & Meta Optimizasyonu:** Open Graph (OG), Twitter Cards ve arama motoru botları için gerekli tüm semantic etiketleme yapılmıştır.

---

## 🛠️ Kullanılan Teknolojiler

* **Markup & Stil:** HTML5 (Semantic), CSS3, SCSS (Sass Preprocessor)
* **Programlama Dili:** Vanilla JavaScript (ES6+)
* **Kütüphaneler & İkonlar:** ApexCharts.js (Grafikler), FontAwesome (Vektörel İkonlar), Google Fonts (Montserrat)
* **Yerleşim (Layout):** CSS Grid Layout & Flexbox

---

## 📁 Proje Dizin Yapısı

```text
📦 OkulProjesi_Kripto
 ┣ 📂 assets/              # Logolar ve kullanıcı ikonları
 ┣ 📂 css/                 # SCSS'ten derlenmiş ana CSS dosyası (main.css)
 ┣ 📂 js/                  # Modüler JS dosyaları
 ┃ ┣ 📜 chart-manager.js   # Canlı fiyat grafikleri yöneticisi
 ┃ ┣ 📜 navigation-manager.js # Akordeon menü ve sayfa geçişleri
 ┃ ┣ 📜 notif-manager.js   # Bildirim sistemi
 ┃ ┣ 📜 script.js          # Ana tetikleyici (Init)
 ┃ ┣ 📜 setup-settings.js  # Sistem ayarları ve sıfırlama
 ┃ ┣ 📜 theme.js           # Koyu/Açık tema motoru
 ┃ ┗ 📜 trade-manager.js   # Alım-satım ve portföy hesaplamaları
 ┣ 📂 scss/                # Parçalanmış (Partial) stil dosyaları
 ┃ ┣ 📜 _base.scss
 ┃ ┣ 📜 _components.scss
 ┃ ┣ 📜 _layout.scss
 ┃ ┣ 📜 _variables.scss
 ┃ ┗ 📜 main.scss          # Tüm SCSS dosyalarını toplayan ana dosya
 ┗ 📜 index.html           # Ana proje dosyası