"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LinkDriveManager =
/*#__PURE__*/
function () {
  function LinkDriveManager() {
    _classCallCheck(this, LinkDriveManager);

    this.firebaseApp = null;
    this.database = null;
  } // Inisialisasi Firebase


  _createClass(LinkDriveManager, [{
    key: "initializeFirebase",
    value: function initializeFirebase() {
      var response, config;
      return regeneratorRuntime.async(function initializeFirebase$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(fetch('/firebase-config'));

            case 3:
              response = _context.sent;
              _context.next = 6;
              return regeneratorRuntime.awrap(response.json());

            case 6:
              config = _context.sent;

              if (config) {
                _context.next = 9;
                break;
              }

              throw new Error('Konfigurasi Firebase tidak valid');

            case 9:
              this.firebaseApp = (0, _firebaseApp.initializeApp)(config);
              this.database = (0, _firebaseDatabase.getDatabase)(this.firebaseApp); // Langsung panggil inisialisasi UI Links

              this.initializeLinksUI();
              _context.next = 18;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](0);
              console.error('Kesalahan inisialisasi Firebase:', _context.t0);
              this.showErrorMessage('Gagal memuat data');

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 14]]);
    } // Tampilkan pesan error

  }, {
    key: "showErrorMessage",
    value: function showErrorMessage(message) {
      var linksContainer = document.getElementById('links-container');

      if (linksContainer) {
        linksContainer.innerHTML = "\n                <li class=\"px-4 py-2 text-sm text-red-500 text-center\">\n                    ".concat(message, "\n                </li>\n            ");
      }
    } // Metode untuk inisialisasi UI Links

  }, {
    key: "initializeLinksUI",
    value: function initializeLinksUI() {
      var _this = this;

      var linksContainer = document.getElementById('links-container');
      if (!linksContainer) return; // Template untuk loading state

      var loadingTemplate = "\n            <li class=\"animate-pulse\">\n                <div class=\"px-4 py-2\">\n                    <div class=\"h-4 bg-gray-200 rounded w-3/4\"></div>\n                </div>\n            </li>\n            <li class=\"animate-pulse\">\n                <div class=\"px-4 py-2\">\n                    <div class=\"h-4 bg-gray-200 rounded w-2/3\"></div>\n                </div>\n            </li>\n            <li class=\"animate-pulse\">\n                <div class=\"px-4 py-2\">\n                    <div class=\"h-4 bg-gray-200 rounded w-1/2\"></div>\n                </div>\n            </li>\n        "; // Template untuk state tidak ada data

      var noDataTemplate = "\n            <li class=\"px-4 py-2 text-sm text-gray-500 text-center\">\n                <div class=\"flex flex-col items-center justify-center space-y-2\">\n                    <svg class=\"w-8 h-8\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" \n                              d=\"M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4\" />\n                    </svg>\n                    <span>Belum ada link tersedia</span>\n                </div>\n            </li>\n        "; // Template untuk item link

      var linkItemTemplate = function linkItemTemplate(data) {
        return "\n            <li>\n                <a href=\"".concat(data.link, "\" target=\"_blank\" class=\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\" role=\"menuitem\">\n                    <div class=\"inline-flex items-center space-x-2\">\n                        <svg class=\"w-4 h-4 text-gray-500\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" \n                                  d=\"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1\" />\n                        </svg>\n                        <span>").concat(data.nama, "</span>\n                    </div>\n                </a>\n            </li>\n        ");
      }; // Tampilkan loading state


      linksContainer.innerHTML = loadingTemplate; // Referensi ke node linkdrive

      var linksRef = (0, _firebaseDatabase.ref)(this.database, 'linkdrive'); // Listener untuk data

      (0, _firebaseDatabase.onValue)(linksRef, function (snapshot) {
        // Periksa apakah data tersedia
        if (!snapshot.exists()) {
          linksContainer.innerHTML = noDataTemplate;
          return;
        } // Siapkan variabel


        var linksHTML = '';
        var linksCount = 0; // Urutkan data berdasarkan timestamp terbaru

        var links = [];
        snapshot.forEach(function (childSnapshot) {
          links.push(_objectSpread({}, childSnapshot.val(), {
            id: childSnapshot.key
          }));
        }); // Urutkan dari yang terbaru

        links.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }); // Render setiap link

        links.forEach(function (data) {
          linksHTML += linkItemTemplate(data);
          linksCount++;
        }); // Update container

        linksContainer.innerHTML = linksHTML; // Update badge jumlah link jika ada

        var badge = document.getElementById('links-count');

        if (badge) {
          badge.textContent = linksCount;
        }
      }, function (error) {
        // Tangani error
        console.error('Error loading links:', error);

        _this.showErrorMessage('Gagal memuat data. Silakan coba lagi nanti.');
      });
    }
  }]);

  return LinkDriveManager;
}(); // Inisialisasi global


var linkDriveManager = new LinkDriveManager();
window.linkDriveManager = linkDriveManager; // Panggil inisialisasi saat dokumen siap

document.addEventListener('DOMContentLoaded', function () {
  linkDriveManager.initializeFirebase();
});