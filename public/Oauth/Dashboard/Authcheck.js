import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const initializeFirebase = (firebaseConfig) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    return {database, auth};
};

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

    const checkUserExists = (user) => {
        if (user) {
            const uid = user.uid;
            const usersRef = ref(database, `admin/${uid}`);
            return get(usersRef).then(snapshot => snapshot.exists());
        }
        return Promise.resolve(false);
    };
    
    // Deteksi elemen loading dan konten
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');
    const content2Element = document.getElementById('content2');
    
    
    // Tampilkan loading
    loadingElement.style.display = 'block';
    
    // Lakukan pengecekan status autentikasi
    onAuthStateChanged(auth, (user) => {
        if (user) {
            checkUserExists(user).then(isAdmin => {
                if (isAdmin) {
                    // Jika user adalah admin, tampilkan konten
                    loadingElement.style.display = 'none';
                    contentElement.style.display = 'block';
                    content2Element.style.display = 'block';
                    
                } else {
                    // Jika user bukan admin, arahkan ke halaman sign-in
                    window.location.href = "/Oauth/Login.html";
                }
            });
        } else {
            // Jika tidak ada user yang login, arahkan ke halaman sign-in
            window.location.href = "/Oauth/Login.html";
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
                    //   location.href = "https://presensi-panitia.vercel.app/Login.html";
                      location.href = "/Oauth/Login.html";
                  });
              }).catch(error => {
                  console.error('Sign out error', error);
              });
          });
      };
      const logoutButton2 = document.getElementById("logout-button2");
      if (logoutButton2) {
          logoutButton2.addEventListener("click", () => {
              signOut(auth).then(() => {
                  Swal.fire({
                      title: 'Logout successful',
                      icon: 'success',
                      timer: 5000,
                      showConfirmButton: false
                  }).then(() => {
                    //   location.href = "https://presensi-panitia.vercel.app/Login.html";
                      location.href = "/Oauth/Login.html";
                  });
              }).catch(error => {
                  console.error('Sign out error', error);
              });
          });
      };
};

