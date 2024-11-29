"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

var _firebaseAuth = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js");

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
    this.auth = null;
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
              this.database = (0, _firebaseDatabase.getDatabase)(this.firebaseApp);
              this.auth = (0, _firebaseAuth.getAuth)(this.firebaseApp);
              this.setupEventListeners();
              this.fetchLinkDrive();
              _context.next = 20;
              break;

            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](0);
              console.error('Kesalahan inisialisasi Firebase:', _context.t0);
              this.showErrorToast('Gagal menginisialisasi aplikasi');

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 16]]);
    } // Pengaturan event listener

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;

      var addButton = document.getElementById('add-linkdrive');

      if (addButton) {
        addButton.addEventListener('click', function () {
          return _this.showAddLinkForm();
        });
      }
    } // Tampilkan form tambah link

  }, {
    key: "showAddLinkForm",
    value: function showAddLinkForm() {
      var _ref, formValues;

      return regeneratorRuntime.async(function showAddLinkForm$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(Swal.fire({
                title: 'Tambah Link Drive',
                html: '<input id="swal-nama" class="swal2-input" placeholder="Nama Link" required>' + '<input id="swal-link" class="swal2-input" placeholder="Link Drive" required>',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal',
                preConfirm: function preConfirm() {
                  var nama = document.getElementById('swal-nama').value.trim();
                  var link = document.getElementById('swal-link').value.trim();

                  if (!nama || !link) {
                    Swal.showValidationMessage('Mohon isi semua field');
                    return false;
                  }

                  return {
                    nama: nama,
                    link: link
                  };
                }
              }));

            case 2:
              _ref = _context2.sent;
              formValues = _ref.value;

              if (!formValues) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return regeneratorRuntime.awrap(this.saveLinkDrive(formValues));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    } // Simpan link drive baru

  }, {
    key: "saveLinkDrive",
    value: function saveLinkDrive(data) {
      var linkRef, newLinkRef;
      return regeneratorRuntime.async(function saveLinkDrive$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              this.showLoadingToast('Menyimpan Data...');
              linkRef = (0, _firebaseDatabase.ref)(this.database, 'linkdrive');
              newLinkRef = (0, _firebaseDatabase.push)(linkRef);
              _context3.next = 6;
              return regeneratorRuntime.awrap((0, _firebaseDatabase.set)(newLinkRef, {
                nama: data.nama,
                link: data.link,
                timestamp: new Date().toISOString()
              }));

            case 6:
              this.showSuccessToast('Data berhasil disimpan!');
              _context3.next = 13;
              break;

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](0);
              console.error('Error saving data:', _context3.t0);
              this.showErrorToast('Gagal menyimpan data');

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 9]]);
    } // Ambil dan tampilkan data link drive

  }, {
    key: "fetchLinkDrive",
    value: function fetchLinkDrive() {
      var _this2 = this;

      var linkRef = (0, _firebaseDatabase.ref)(this.database, 'linkdrive');
      (0, _firebaseDatabase.onValue)(linkRef, function (snapshot) {
        var tableBody = document.getElementById('table-linkdrive');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
          var id = childSnapshot.key;
          var data = childSnapshot.val();

          var row = _this2.createTableRow(id, data);

          tableBody.appendChild(row);
        });
      });
    } // Buat baris tabel

  }, {
    key: "createTableRow",
    value: function createTableRow(id, data) {
      var row = document.createElement('tr');
      row.innerHTML = "\n            <td class=\"py-4 px-6 text-center\">".concat(new Date(data.timestamp).toLocaleString(), "</td>\n            <td class=\"py-4 px-6 text-center\">").concat(data.nama, "</td>\n            <td class=\"py-4 px-6 text-center\">\n                <a href=\"").concat(data.link, "\" target=\"_blank\" class=\"text-blue-600 hover:text-blue-800 truncate\">").concat(data.link, "</a>\n            </td>\n            <td class=\"py-4 px-6 flex justify-center gap-2\">\n                <button onclick=\"linkDriveManager.editLink('").concat(id, "', '").concat(data.nama, "', '").concat(data.link, "')\" \n                        class=\"bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded\">\n                    Edit\n                </button>\n                <button onclick=\"linkDriveManager.deleteLink('").concat(id, "')\"\n                        class=\"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded\">\n                    Hapus\n                </button>\n            </td>\n        ");
      return row;
    } // Edit link drive

  }, {
    key: "editLink",
    value: function editLink(id, nama, link) {
      var _ref2, formValues, linkRef;

      return regeneratorRuntime.async(function editLink$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(Swal.fire({
                title: 'Edit Link Drive',
                html: "<input id=\"swal-nama\" class=\"swal2-input\" placeholder=\"Nama Link\" value=\"".concat(nama, "\" required>") + "<input id=\"swal-link\" class=\"swal2-input\" placeholder=\"Link Drive\" value=\"".concat(link, "\" required>"),
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Update',
                cancelButtonText: 'Batal',
                preConfirm: function preConfirm() {
                  var newNama = document.getElementById('swal-nama').value.trim();
                  var newLink = document.getElementById('swal-link').value.trim();

                  if (!newNama || !newLink) {
                    Swal.showValidationMessage('Mohon isi semua field');
                    return false;
                  }

                  return {
                    nama: newNama,
                    link: newLink
                  };
                }
              }));

            case 2:
              _ref2 = _context4.sent;
              formValues = _ref2.value;

              if (!formValues) {
                _context4.next = 17;
                break;
              }

              _context4.prev = 5;
              this.showLoadingToast('Mengupdate Data...');
              linkRef = (0, _firebaseDatabase.ref)(this.database, "linkdrive/".concat(id));
              _context4.next = 10;
              return regeneratorRuntime.awrap((0, _firebaseDatabase.update)(linkRef, {
                nama: formValues.nama,
                link: formValues.link,
                timestamp: new Date().toISOString()
              }));

            case 10:
              this.showSuccessToast('Data berhasil diupdate!');
              _context4.next = 17;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](5);
              console.error('Error updating data:', _context4.t0);
              this.showErrorToast('Gagal mengupdate data');

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[5, 13]]);
    } // Hapus link drive

  }, {
    key: "deleteLink",
    value: function deleteLink(id) {
      var result, linkRef;
      return regeneratorRuntime.async(function deleteLink$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
              }));

            case 2:
              result = _context5.sent;

              if (!result.isConfirmed) {
                _context5.next = 16;
                break;
              }

              _context5.prev = 4;
              this.showLoadingToast('Menghapus Data...');
              linkRef = (0, _firebaseDatabase.ref)(this.database, "linkdrive/".concat(id));
              _context5.next = 9;
              return regeneratorRuntime.awrap((0, _firebaseDatabase.remove)(linkRef));

            case 9:
              this.showSuccessToast('Data berhasil dihapus!');
              _context5.next = 16;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](4);
              console.error('Error deleting data:', _context5.t0);
              this.showErrorToast('Gagal menghapus data');

            case 16:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[4, 12]]);
    } // Tampilan toast untuk loading

  }, {
    key: "showLoadingToast",
    value: function showLoadingToast(message) {
      Swal.fire({
        title: message,
        allowOutsideClick: false,
        didOpen: function didOpen() {
          Swal.showLoading();
        }
      });
    } // Tampilan toast untuk sukses

  }, {
    key: "showSuccessToast",
    value: function showSuccessToast(message) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: message
      });
    } // Tampilan toast untuk error

  }, {
    key: "showErrorToast",
    value: function showErrorToast(message) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
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