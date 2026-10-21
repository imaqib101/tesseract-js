# Tesseract.js OCR Web Engine 🔍

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-v4-5C6BC0?style=for-the-badge)](https://tesseract.projectnaptha.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

A client-side Optical Character Recognition (OCR) web engine powered by **Tesseract.js** (WebAssembly / Web Workers). Extracts text from scanned documents, receipts, screenshots, and photos entirely in the browser with zero server overhead.

---

## ⚡ Highlights

- 🌐 **100% Client-Side**: All image recognition runs locally via WebAssembly Web Workers — no data leaves the browser.
- 🖼️ **Multi-Format Support**: Supports PNG, JPEG, WEBP, BMP, and PBM image formats.
- 📊 **Real-Time Progress Tracking**: Live worker status and recognition confidence scoring.
- 📋 **One-Click Export**: Copy extracted text directly to clipboard with formatted spacing preserved.
- 🎨 **Modern Interface**: Clean responsive UI with drag-and-drop zone and image preview.

---

## 🚀 Quick Start

### Option 1: Direct Browser Access
Simply open `index.html` in any modern web browser or serve it with a static file server:

```bash
# Using Python built-in server
python3 -m http.server 3000

# Or using npx serve
npx serve .
```

Open [http://localhost:3000](http://localhost:3000).

---

## 💻 Code Example

```javascript
import { createWorker } from "tesseract.js";

async function recognizeImage(imageFile) {
  const worker = await createWorker("eng");
  
  const { data: { text, confidence } } = await worker.recognize(imageFile);
  console.log(`Recognized Text (${confidence}% confidence):`, text);
  
  await worker.terminate();
  return text;
}
```

---

## 📂 Architecture

```text
├── index.html         # Application shell with drag-and-drop canvas
├── style.css          # Modern dark-mode styling and animations
├── app.js             # Tesseract worker lifecycle & recognition pipeline
└── README.md          # Project documentation
```

---

## 👤 Author

**Mohammed Aqib**
- GitHub: [@imaqib101](https://github.com/imaqib101)
- Location: Bengaluru, India
