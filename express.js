import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Memuat variabel lingkungan dari .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Menentukan path direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Menambahkan header Cache-Control untuk mencegah caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Mengatur header untuk tidak menggunakan cache
  next();
});

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk mengirimkan konfigurasi Firebase
app.get('/firebase-config', (req, res) => {
  try {
    res.json({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
  } catch (error) {
    console.error('Error retrieving Firebase config:', error);
    res.status(500).json({ error: 'Gagal mengambil konfigurasi Firebase' });
  }
});

// Mengirimkan index.html saat root diakses
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
