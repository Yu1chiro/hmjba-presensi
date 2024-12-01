import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
// Handler untuk rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Not Found</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-r from-[#2B3784] to-[#4361EE] flex items-center justify-center min-h-screen">
  <div class="text-center">
   <div class="flex justify-center">
    <img src="/logo.png" width="150px" height="auto" class="rounded-full" alt="">
   </div>
    <p class="text-2xl text-white mt-4">Oops! Page Not Found</p>
    <p class="text-white mt-2">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" style="box-shadow:0 0 4px white;" class="mt-6 inline-block px-6 py-2 text-white bg-blue-700 hover:bg-blue-900 rounded-lg">
      Go Back to Home
    </a>
  </div>
</body>
</html>

    `);
});
