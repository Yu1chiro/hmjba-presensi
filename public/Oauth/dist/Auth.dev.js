"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseAuth = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

// public/interface.js
// Fungsi untuk menginisialisasi Firebase setelah mengambil konfigurasi dari server
var initializeFirebase = function initializeFirebase(firebaseConfig) {
  var app = (0, _firebaseApp.initializeApp)(firebaseConfig);
  var auth = (0, _firebaseAuth.getAuth)(app);
  var database = (0, _firebaseDatabase.getDatabase)(app);
  return {
    auth: auth,
    database: database
  }; // Mengembalikan objek yang berisi auth dan database
}; // Fungsi utama yang dijalankan saat DOM telah dimuat


document.addEventListener('DOMContentLoaded', function () {
  // Mengambil konfigurasi Firebase dari server dan menginisialisasi Firebase
  fetch('/firebase-config').then(function (response) {
    return response.json();
  }).then(function (config) {
    var _initializeFirebase = initializeFirebase(config),
        auth = _initializeFirebase.auth,
        database = _initializeFirebase.database; // Mendapatkan auth dan database


    initializeAppFunctions(auth, database); // Meneruskan auth dan database ke initializeAppFunctions
  })["catch"](function (error) {
    console.error('Gagal mengambil konfigurasi Firebase:', error);
  });
}); // Fungsi untuk menginisialisasi fungsi-fungsi lain setelah Firebase siap

var initializeAppFunctions = function initializeAppFunctions(auth, database) {
  // Fungsi untuk memformat timestamp menjadi format yang mudah dibaca
  var formatTimestamp = function formatTimestamp(timestamp) {
    var date = new Date(timestamp);
    return date.toLocaleString();
  }; // Fungsi untuk memeriksa apakah user adalah admin


  var checkUserExists = function checkUserExists(user) {
    if (user) {
      var uid = user.uid;
      var usersRef = (0, _firebaseDatabase.ref)(database, "admin/".concat(uid));
      return (0, _firebaseDatabase.get)(usersRef).then(function (snapshot) {
        return snapshot.exists();
      });
    }

    return Promise.resolve(false);
  }; // Mendefinisikan apakah halaman adalah Dashboard atau Login


  var isAdminPage = window.location.href.includes("Dashboard.html");
  var isLoginPage = window.location.href.includes("Login.html"); // Mengambil elemen loading dan konten

  var loadingElement = document.getElementById('loading');
  var contentElement = document.getElementById('content');
  var content2Element = document.getElementById('content2');

  if (loadingElement) {
    loadingElement.style.display = 'block';
  }

  (0, _firebaseAuth.onAuthStateChanged)(auth, function (user) {
    if (user) {
      checkUserExists(user).then(function (isAdmin) {
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
      })["catch"](function (error) {
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
  }); // Logout

  var logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      (0, _firebaseAuth.signOut)(auth).then(function () {
        Swal.fire({
          title: 'Logout successful',
          icon: 'success',
          timer: 5000,
          showConfirmButton: false
        }).then(function () {
          // Redirect ke halaman login setelah logout
          location.href = "/Oauth/Login.html";
        });
      })["catch"](function (error) {
        console.error('Sign out error', error);
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Gagal melakukan logout. Silakan coba lagi.'
        });
      });
    });
  } else {
    console.warn("Element dengan ID 'logout-button' tidak ditemukan.");
  }
};