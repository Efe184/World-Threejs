# 🌍 Planet Viewer

Interactive 3D Earth visualization built with THREE.js and Vite.

## 🚀 Live Demo

**🌐 Vercel:** [https://world-threejs.vercel.app/](https://world-threejs.vercel.app/)  
**📦 GitHub Pages:** [https://efe184.github.io/world-threejs/](https://efe184.github.io/world-threejs/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Efe184/World-Threejs)

## ✨ Features

- **Realistic Earth Model** with multiple texture layers
- **4 Visual Layers**:
  - 🌎 Main Earth surface (bump & specular mapping)
  - 🌃 Night city lights
  - ☁️ Cloud layer with transparency
  - 💫 Atmospheric glow (Fresnel shader)
- **2000 Stars** background with particle system
- **Interactive Controls**:
  - 🖱️ Mouse drag to rotate
  - 🔍 Scroll to zoom
  - ⌨️ Keyboard shortcuts (a: auto-rotate, r: reset)
- **Responsive Design** - Works on all screen sizes
- **Performance Optimized** with Vite bundler

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
planet-viewer/
├── src/
│   ├── main.js              # Main scene setup
│   ├── getFresnelMat.js     # Atmospheric glow shader
│   └── getStarfield.js      # Star particle system
├── textures/                # Earth texture maps
│   ├── 00_earthmap1k.jpg    # Color map
│   ├── 01_earthbump1k.jpg   # Bump map
│   ├── 02_earthspec1k.jpg   # Specular map
│   ├── 03_earthlights1k.jpg # Night lights
│   ├── 04_earthcloudmap.jpg # Cloud layer
│   ├── 05_earthcloudmaptrans.jpg # Cloud alpha
│   └── stars/
│       └── circle.png       # Star particle texture
├── index.html               # Entry HTML
├── vite.config.js           # Vite configuration
└── package.json

```

## 🎮 Controls

### Mouse Controls
| Action | Control | Description |
|--------|---------|-------------|
| **Rotate** | Left-click + Drag | Freely rotate the Earth |
| **Zoom** | Mouse Wheel | Adjust camera distance |
| **Pan** | Right-click + Drag | Move camera horizontally/vertically |

### Keyboard Shortcuts
| Key | Function | Description |
|-----|----------|-------------|
| `A` | Auto-rotate | Toggle automatic rotation |
| `R` | Reset | Reset camera to initial position |
| `H` | Toggle UI | Show/hide control panel |
| `F` | Fullscreen | Enter/exit fullscreen mode |
| `S` | Screenshot | Save current view as PNG |

## 🛠 Technologies

- **THREE.js** (v0.180.0) - 3D graphics library
- **Vite** (v7.1.12) - Fast build tool
- **WebGL** - Hardware-accelerated rendering
- **GLSL Shaders** - Custom atmospheric effects

## 🚀 Deployment

This project is deployed on two platforms:

### Vercel (Recommended)
- **URL:** [https://world-threejs.vercel.app/](https://world-threejs.vercel.app/)
- **Auto-deploy:** Enabled on push to `main` branch
- **Environment:** Production optimized
- **Deploy your own:** 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Efe184/World-Threejs)



### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Learning Resources

- [THREE.js Documentation](https://threejs.org/docs/)
- [Earth Textures Source](https://planetpixelemporium.com/earth.html)
- [Fresnel Effect Explained](https://en.wikipedia.org/wiki/Fresnel_equations)

## 🎨 Texture Credits

Earth texture maps from [Planet Pixel Emporium](https://planetpixelemporium.com/earth.html)

## 📝 License

MIT License - Feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using THREE.js

