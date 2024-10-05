// public/interface.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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

    let signinButton = document.getElementById("signin-button");
    let signupButton = document.getElementById("signup-button");

    // Function to show the loading overlay
    function showLoading(button) {
        // Show the loading overlay
        const loadingOverlay = document.getElementById("loadingOverlay");
        if (loadingOverlay) {
            loadingOverlay.style.display = "flex";
        }

        // Save original button content (optional)
        button.originalText = button.innerHTML;

        // Optionally disable the button to prevent multiple clicks
        button.disabled = true;
    }

    // Function to hide the loading overlay
    function hideLoading(button) {
        // Hide the loading overlay
        const loadingOverlay = document.getElementById("loadingOverlay");
        if (loadingOverlay) {
            loadingOverlay.style.display = "none";
        }

        // Restore original button content (optional)
        if (button.originalText) {
            button.innerHTML = button.originalText;
        }

        // Re-enable the button
        button.disabled = false;
    }

    // Event listener untuk tombol sign-up
    if (signupButton) {
        signupButton.addEventListener("click", (e) => {
            e.preventDefault();
            showLoading(signupButton);

            let name = document.getElementById("name").value.trim();
            let nohp = document.getElementById("nohp").value.trim();
            let emailSignup = document.getElementById("email_signup").value.trim();
            let passwordSignup = document.getElementById("psw_signup").value.trim();

            if (!name || !nohp || !emailSignup || !passwordSignup) {
                Swal.fire({
                    icon: 'error',
                    title: 'Data Tidak Lengkap',
                    text: 'Harap isi semua field yang diperlukan.',
                });
                hideLoading(signupButton);
                return;
            }

            createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
                .then((userCredential) => {
                    const user = userCredential.user;

                    return set(ref(database, "admin/" + user.uid), {
                        name: name,
                        nohp: nohp,
                        email: emailSignup,
                        password: passwordSignup, // **Catatan Keamanan:** Menyimpan password secara plaintext di database sangat tidak dianjurkan. Pertimbangkan untuk menghapus field ini atau menggunakan metode yang lebih aman.
                        admin: true
                    });
                })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        text: 'Berhasil Membuat Akun Admin'
                    }).then(() => {
                        // Berpindah ke halaman login setelah sign-up berhasil
                        document.getElementById('page-register').classList.remove('active');
                        document.getElementById('page-login').classList.add('active');
                    });
                })
                .catch((error) => {
                    console.error("Error during sign-up:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Membuat Akun',
                        text: error.message,
                    });
                })
                .finally(() => {
                    hideLoading(signupButton);
                });
        });
    } else {
        console.warn("Element dengan ID 'signup-button' tidak ditemukan.");
    }

    // Event listener untuk tombol sign-in
    if (signinButton) {
        signinButton.addEventListener("click", (e) => {
            e.preventDefault();
            showLoading(signinButton);

            let emailSignin = document.getElementById("email_signin").value.trim();
            let passwordSignin = document.getElementById("psw_signin").value.trim();

            if (!emailSignin || !passwordSignin) {
                Swal.fire({
                    icon: 'error',
                    title: 'Data Tidak Lengkap',
                    text: 'Harap isi semua field yang diperlukan.',
                });
                hideLoading(signinButton);
                return;
            }

            signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
                .then((userCredential) => {
                    const user = userCredential.user;

                    const dbRef = ref(database);
                    return get(child(dbRef, `admin/${user.uid}`))
                        .then((snapshot) => {
                            if (snapshot.exists() && snapshot.val().admin === true) {
                                // Redirect ke dashboard admin
                                location.href = "/Oauth/Dashboard/Dashboard.html";
                                // location.href = "https://presensi-panitia.vercel.app/auth/dashboard/Panel-Inspi.html";
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Akses Ditolak',
                                    text: 'Hanya admin yang dapat mengakses dashboard.',
                                });
                                return signOut(auth);
                            }
                        });
                })
                .catch((error) => {
                    console.error("Error during sign-in:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Oops! Email & Password Salah',
                    });
                })
                .finally(() => {
                    hideLoading(signinButton);
                });
        });
    } else {
        console.warn("Element dengan ID 'signin-button' tidak ditemukan.");
    }

};
