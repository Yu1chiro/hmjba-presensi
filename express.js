import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin'; // Firebase Admin SDK untuk validasi token

dotenv.config(); // Memuat variabel lingkungan dari .env

const app = express();
const port = process.env.PORT || 3000;

// Menentukan path direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Middleware untuk memvalidasi token Firebase
const validateFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header Authorization
  if (!token) {
    return res.status(401).send('Unauthorized: Token missing');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized: Invalid token');
  }
};

// Middleware untuk mencegah caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Mengatur header untuk tidak menggunakan cache
  next();
});

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk mengirimkan konfigurasi Firebase
app.get('/firebase-config', (req, res) => {
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
});

// Endpoint untuk presensi-active dan countdown yang bisa diakses oleh semua pengguna
app.get('/data/:path', async (req, res) => {
  const allowedPaths = ['presensi-active', 'countdown-Inspi', 'countdown-potluck', 'Presensi-Inspi', 'Presensi-Potluck','Potluck-Telat','Inspi-Telat','Presensi-Uday','Uday-Telat'];
  const { path } = req.params;

  if (!allowedPaths.includes(path)) {
    return res.status(403).send('Forbidden');
  }

  try {
    const db = admin.database();
    const ref = db.ref(path);
    const snapshot = await ref.once('value');
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});
// Endpoint untuk admin dan migrate-data yang hanya bisa diakses admin
app.get('/admin/:path', validateFirebaseToken, async (req, res) => {
  const allowedAdminPaths = ['admin', 'migrate-data'];
  const { path } = req.params;

  if (!allowedAdminPaths.includes(path)) {
    return res.status(403).send('Forbidden');
  }

  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden: Admin access required');
  }

  try {
    const db = admin.database();
    const ref = db.ref(path);
    const snapshot = await ref.once('value');
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).send('Error fetching data');
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