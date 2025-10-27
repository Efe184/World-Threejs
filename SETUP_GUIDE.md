# 🚀 Planet Viewer - Kurulum ve Kullanım Kılavuzu

## 📦 Proje Özeti

Modern web geliştirme araçları kullanılarak oluşturulmuş, interaktif 3D Dünya görselleştirme projesi.

### 🔄 Teknik Özellikler

| Özellik | Detay |
|---------|-------|
| **Module System** | NPM + ES Modules |
| **Bundler** | Vite |
| **Package Manager** | NPM |
| **Performans** | Mükemmel (Tree-shaking) |
| **Offline Çalışma** | ✅ |
| **TypeScript Desteği** | ✅ (hazır) |
| **Hot Module Reload** | ✅ |
| **Production Build** | Otomatik |

---

## 🎯 Kurulum Adımları

### 1️⃣ Bağımlılıkları Yükle

```bash
npm install
```

Bu komut şunları yükler:
- `three` (v0.180.0) - THREE.js kütüphanesi
- `vite` (v7.1.12) - Build tool (dev dependency)

### 2️⃣ Development Server'ı Başlat

```bash
npm run dev
```

Tarayıcınız otomatik olarak `http://localhost:3000` adresinde açılacak.

### 3️⃣ Production Build

```bash
npm run build
```

Optimize edilmiş dosyalar `dist/` klasörüne oluşturulur.

### 4️⃣ Production Preview

```bash
npm run preview
```

Build edilmiş versiyonu test eder.

---

## 📂 Proje Yapısı Açıklaması

```
planet-viewer/
│
├── 📄 index.html              # Ana HTML (loading screen + UI)
├── 📄 vite.config.js          # Vite yapılandırması
├── 📄 package.json            # NPM bağımlılıkları & scriptler
│
├── 📁 src/                    # JavaScript modülleri
│   ├── main.js                # 🎬 Ana sahne (scene, camera, render loop)
│   ├── getFresnelMat.js       # 💫 Atmosfer shader'ı (GLSL)
│   └── getStarfield.js        # ⭐ Yıldız partikülleri
│
└── 📁 textures/               # Dünya doku haritaları
    ├── 00_earthmap1k.jpg      # 🌎 Ana renk haritası
    ├── 01_earthbump1k.jpg     # 🏔️ Yükseklik haritası
    ├── 02_earthspec1k.jpg     # 💧 Yansıma haritası (su/kara)
    ├── 03_earthlights1k.jpg   # 🌃 Gece şehir ışıkları
    ├── 04_earthcloudmap.jpg   # ☁️ Bulut katmanı
    ├── 05_earthcloudmaptrans.jpg # ☁️ Bulut şeffaflığı
    └── stars/
        └── circle.png         # ✨ Yıldız doku noktası
```

---

## 🎮 Kontroller

### 🖱️ Mouse/Dokunma Kontrolleri
| Aksiyon | Kontrol | Açıklama |
|---------|---------|----------|
| **Döndür** | Sol tık + sürükle | Dünyayı serbest şekilde döndür |
| **Yakınlaş/Uzaklaş** | Scroll (tekerlek) | Kamera zoom seviyesini ayarla |
| **Kaydır (Pan)** | Sağ tık + sürükle | Kamerayı yatay/dikey kaydır |

### ⌨️ Klavye Kısayolları
| Tuş | Fonksiyon | Detay |
|-----|-----------|-------|
| `A` | Toggle auto-rotate | Otomatik dönüşü aç/kapat |
| `R` | Reset camera | Kamerayı başlangıç konumuna getir |

---

## 🛠 Teknik Detaylar

### Kullanılan THREE.js Bileşenleri

1. **Scene & Renderer**
   - `THREE.Scene()` - 3D ortam
   - `THREE.WebGLRenderer()` - GPU rendering
   - `ACESFilmicToneMapping` - Sinematik renk

2. **Geometri**
   - `IcosahedronGeometry(1, 12)` - Yüksek detaylı küre
   - 12 subdivision seviyesi = ~10,000+ üçgen

3. **Materyaller**
   - `MeshPhongMaterial` - Ana dünya (bump + specular)
   - `MeshBasicMaterial` - Gece ışıkları (unlit)
   - `MeshStandardMaterial` - Bulutlar (PBR)
   - `ShaderMaterial` - Atmosfer parlaması (custom GLSL)

4. **Işıklandırma**
   - `DirectionalLight` - Güneş simülasyonu
   - `AmbientLight` - Ortam aydınlatması

5. **Kontroller**
   - `OrbitControls` - Mouse/touch etkileşimi
   - Damping (sönümleme) efekti
   - Zoom limitleri (2-15 birim)

### Performans Optimizasyonları

✅ **BufferGeometry** - Düşük bellek kullanımı  
✅ **Texture Loading** - Asenkron yükleme  
✅ **Vite Tree-shaking** - Kullanılmayan kod temizlenir  
✅ **PixelRatio** - Retina ekranlar için otomatik ayarlama  
✅ **RequestAnimationFrame** - 60 FPS hedefi  

---

## 🎨 Görsel Katmanlar

Dünya modeli **4 ayrı mesh** katmanından oluşur:

### 1. Ana Dünya Yüzeyi (earthMesh)
```javascript
- Dönüş hızı: 0.002 rad/frame
- Bump mapping: Dağ/vadi detayları
- Specular mapping: Su parlama efekti
```

### 2. Gece Işıkları (lightsMesh)
```javascript
- Additive blending: Ana dünya üzerine ışık ekler
- Dönüş hızı: earthMesh ile aynı
```

### 3. Bulut Katmanı (cloudsMesh)
```javascript
- Dönüş hızı: 0.0023 rad/frame (daha hızlı!)
- Scale: 1.003 (dünyadan %0.3 daha büyük)
- Alpha mapping: Şeffaf bulut kenarları
```

### 4. Atmosfer Parlaması (glowMesh)
```javascript
- Fresnel shader: Kenarlarda mavi parlama
- Scale: 1.01 (dünyadan %1 daha büyük)
- Additive blending: Atmosfer efekti
```

---

## 🔬 Fresnel Shader Açıklaması

Atmosfer parlaması için custom GLSL shader kullanılır:

### Vertex Shader
```glsl
// Kamera ile yüzey normali arasındaki açıyı hesaplar
vec3 I = worldPosition.xyz - cameraPosition;
vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);
```

### Fragment Shader
```glsl
// İki rengi (siyah → mavi) karıştırır
float f = clamp(vReflectionFactor, 0.0, 1.0);
gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
```

**Sonuç**: Dünyanın kenarlarında gerçekçi mavi atmosfer parlaması! 🌐

---


## 🐛 Sorun Giderme

### Texture'lar yüklenmiyor
- Tarayıcı console'da CORS hatası var mı kontrol et
- `textures/` klasörünün doğru yerde olduğundan emin ol

### Siyah ekran
- Console'da THREE.js hataları kontrol et
- WebGL desteği var mı: `chrome://gpu/`

### Performans düşük
```javascript
// detail değerini düşür
const detail = 8; // (12 yerine)

// Yıldız sayısını azalt
const stars = getStarfield({ numStars: 1000 });
```

---

## 📚 Öğrenme Kaynakları

- [THREE.js Docs](https://threejs.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [GLSL Shader Tutorial](https://thebookofshaders.com/)
- [Earth Textures](https://planetpixelemporium.com/earth.html)

---


**THREE.js Versiyonu**: 0.180.0  
**Vite Versiyonu**: 7.1.12

🌍 **Keyifli kodlamalar!** 🚀

