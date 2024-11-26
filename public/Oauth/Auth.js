// public/interface.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Fungsi untuk menginisialisasi Firebase setelah mengambil konfigurasi dari server
const initializeFirebase = (firebaseConfig) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    return { auth, database }; // Mengembalikan objek yang berisi auth dan database
};

// Fungsi utama yang dijalankan saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Mengambil konfigurasi Firebase dari server dan menginisialisasi Firebase
    fetch('/firebase-config')
        .then(response => response.json())
        .then(config => {
            const { auth, database } = initializeFirebase(config); // Mendapatkan auth dan database
            initializeAppFunctions(auth, database); // Meneruskan auth dan database ke initializeAppFunctions
        })
        .catch(error => {
            console.error('Gagal mengambil konfigurasi Firebase:', error);
        });
});

// Fungsi untuk menginisialisasi fungsi-fungsi lain setelah Firebase siap
const initializeAppFunctions = (auth, database) => {

    // Fungsi untuk memformat timestamp menjadi format yang mudah dibaca
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Fungsi untuk memeriksa apakah user adalah admin
    const checkUserExists = (user) => {
        if (user) {
            const uid = user.uid;
            const usersRef = ref(database, `admin/${uid}`);
            return get(usersRef).then(snapshot => snapshot.exists());
        }
        return Promise.resolve(false);
    };

    // Mendefinisikan apakah halaman adalah Dashboard atau Login
    const isAdminPage = window.location.href.includes("Dashboard.html");
    const isLoginPage = window.location.href.includes("Login.html");

    // Mengambil elemen loading dan konten
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');
    const content2Element = document.getElementById('content2');

    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            checkUserExists(user).then(isAdmin => {
                if (isAdmin && isAdminPage) {
                    if (loadingElement) loadingElement.style.display = 'none';
                    if (contentElement) contentElement.style.display = 'block';
                    if (content2Element) content2Element.style.display = 'block';
                } else if (!isAdmin && isAdminPage) {
                    // Redirect ke halaman login jika user bukan admin tetapi berada di halaman admin
                    window.location.href = "/Oauth/Login.html";
                } else if (isAdmin && !isAdminPage) {
                    // Redirect ke dashboard jika user adalah admin tetapi tidak berada di halaman admin
                    window.location.href = "/Oauth/Dashboard/Dashboard.html";
                } else {
                    if (loadingElement) loadingElement.style.display = 'none';
                    if (contentElement) contentElement.style.display = 'block';
                    if (content2Element) content2Element.style.display = 'block';
                }
            }).catch(error => {
                console.error("Error checking admin status:", error);
            });
        } else {
            if (!isLoginPage) {
                // Redirect ke halaman login jika user tidak terautentikasi dan tidak berada di halaman login
                window.location.href = "/Oauth/Login.html";
            } else {
                if (loadingElement) loadingElement.style.display = 'none';
                if (contentElement) contentElement.style.display = 'block';
                if (content2Element) content2Element.style.display = 'block';
            }
        }
    });

    // Logout
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                Swal.fire({
                    title: 'Logout successful',
                    icon: 'success',
                    timer: 5000,
                    showConfirmButton: false
                }).then(() => {
                    // Redirect ke halaman login setelah logout
                    location.href = "/Oauth/Login.html";
                });
            }).catch(error => {
                console.error('Sign out error', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal melakukan logout. Silakan coba lagi.',
                });
            });
        });
    } else {
        console.warn("Element dengan ID 'logout-button' tidak ditemukan.");
    }
      
};
