"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

var _firebaseAuth = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js");

// Variabel global untuk konfigurasi Firebase
var firebaseConfig = null;
var firebaseAppInstance = null; // Fungsi untuk mendapatkan konfigurasi Firebase

function fetchFirebaseConfig() {
  var response;
  return regeneratorRuntime.async(function fetchFirebaseConfig$(_context) {
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
          firebaseConfig = _context.sent;

          if (firebaseConfig) {
            _context.next = 9;
            break;
          }

          throw new Error('Konfigurasi Firebase tidak valid');

        case 9:
          // Inisialisasi Firebase App hanya jika belum diinisialisasi
          if (!firebaseAppInstance) {
            firebaseAppInstance = (0, _firebaseApp.initializeApp)(firebaseConfig);
          }

          return _context.abrupt("return", firebaseAppInstance);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Kesalahan mengambil konfigurasi Firebase:', _context.t0);
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan',
            text: 'Gagal mendapatkan konfigurasi Firebase'
          });
          throw _context.t0;

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
} // Konversi gambar ke Base64


function convertImageToBase64(file) {
  return regeneratorRuntime.async(function convertImageToBase64$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function () {
              return resolve(reader.result);
            };

            reader.onerror = function (error) {
              return reject(error);
            };
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
} // Tambah Anggota


function tambahAnggota(nama, thumbnail, jabatan, link) {
  var database, membersRef, newMemberRef;
  return regeneratorRuntime.async(function tambahAnggota$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          Swal.fire({
            title: 'Memproses...',
            html: 'Sedang mengunggah data',
            didOpen: function didOpen() {
              Swal.showLoading();
            }
          }); // Pastikan Firebase sudah diinisialisasi

          _context3.next = 4;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 4:
          database = (0, _firebaseDatabase.getDatabase)();
          membersRef = (0, _firebaseDatabase.ref)(database, 'structure-member');
          newMemberRef = (0, _firebaseDatabase.push)(membersRef);
          _context3.next = 9;
          return regeneratorRuntime.awrap((0, _firebaseDatabase.set)(newMemberRef, {
            nama: nama,
            thumbnail: thumbnail,
            jabatan: jabatan,
            link: link,
            timestamp: (0, _firebaseDatabase.serverTimestamp)()
          }));

        case 9:
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Anggota baru telah ditambahkan'
          }); // Refresh tabel setelah menambahkan anggota

          tampilkanAnggota();
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan',
            text: 'Gagal menambahkan anggota'
          });
          console.error('Kesalahan:', _context3.t0);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
} // Tampilkan Anggota dalam Tabel


function tampilkanAnggota() {
  var database, membersRef;
  return regeneratorRuntime.async(function tampilkanAnggota$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 3:
          database = (0, _firebaseDatabase.getDatabase)();
          membersRef = (0, _firebaseDatabase.ref)(database, 'structure-member');
          (0, _firebaseDatabase.onValue)(membersRef, function (snapshot) {
            var tableBody = document.getElementById('table-member');
            tableBody.innerHTML = '';
            snapshot.forEach(function (childSnapshot) {
              var member = childSnapshot.val();
              var memberId = childSnapshot.key;
              var row = document.createElement('tr');
              row.innerHTML = "\n                    <td class=\"py-3 px-6 text-center\">".concat(new Date(member.timestamp).toLocaleString(), "</td>\n                    <td class=\"py-3 px-6 text-center\">").concat(member.nama, "</td>\n                    <td class=\"py-3 px-6 text-center\">").concat(member.jabatan, "</td>\n                     <td class=\"py-3 px-6 text-center\">\n                        <img src=\"").concat(member.thumbnail, "\" class=\"w-16 h-16 object-cover mx-auto\" />\n                    </td>\n                    <td class=\"py-3 px-6 text-center\">").concat(member.link, "</td>\n                    <td class=\"py-3 px-6 flex space-x-2\">\n                        <button onclick=\"window.detailAnggota('").concat(memberId, "')\" class=\"bg-blue-500 text-white px-3 py-1 rounded\">Detail</button>\n                        <button onclick=\"window.editAnggota('").concat(memberId, "')\" class=\"bg-yellow-500 text-white px-3 py-1 rounded\">Edit</button>\n                        <button onclick=\"window.hapusAnggota('").concat(memberId, "')\" class=\"bg-red-500 text-white px-3 py-1 rounded\">Hapus</button>\n                    </td>\n                ");
              tableBody.appendChild(row);
            });
          });
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error('Kesalahan menampilkan anggota:', _context4.t0);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
} // Detail Anggota


function detailAnggota(memberId) {
  var database, memberRef, snapshot, member;
  return regeneratorRuntime.async(function detailAnggota$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 3:
          database = (0, _firebaseDatabase.getDatabase)();
          memberRef = (0, _firebaseDatabase.ref)(database, "structure-member/".concat(memberId));
          _context5.next = 7;
          return regeneratorRuntime.awrap((0, _firebaseDatabase.get)(memberRef));

        case 7:
          snapshot = _context5.sent;

          if (snapshot.exists()) {
            member = snapshot.val();
            Swal.fire({
              title: 'Detail Anggota',
              html: "\n                <img src=\"".concat(member.thumbnail, "\" class=\"mx-auto mt-4\" style=\"max-width: 300px;\" />\n                    <p><strong>Nama:</strong> ").concat(member.nama, "</p>\n                    <p><strong>Jabatan:</strong> ").concat(member.jabatan, "</p>\n                    <p><strong>Link:</strong> ").concat(member.link, "</p>\n                "),
              showCloseButton: true
            });
          }

          _context5.next = 14;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error('Kesalahan mendapatkan detail anggota:', _context5.t0);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
} // Edit Anggota


function editAnggota(memberId) {
  var database, memberRef, snapshot, member;
  return regeneratorRuntime.async(function editAnggota$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 3:
          database = (0, _firebaseDatabase.getDatabase)();
          memberRef = (0, _firebaseDatabase.ref)(database, "structure-member/".concat(memberId));
          _context7.next = 7;
          return regeneratorRuntime.awrap((0, _firebaseDatabase.get)(memberRef));

        case 7:
          snapshot = _context7.sent;

          if (snapshot.exists()) {
            member = snapshot.val();
            Swal.fire({
              title: 'Edit Anggota',
              html: "\n                    <input id=\"swal-input-nama\" class=\"swal2-input\" placeholder=\"Nama\" value=\"".concat(member.nama, "\">\n                    <input id=\"swal-input-jabatan\" class=\"swal2-input\" placeholder=\"Jabatan\" value=\"").concat(member.jabatan, "\">\n                    <input id=\"swal-input-link\" class=\"swal2-input\" placeholder=\"Link\" value=\"").concat(member.link, "\">\n                    <input type=\"file\" id=\"swal-input-thumbnail\" class=\"swal2-input\" accept=\"image/*\">\n                "),
              focusConfirm: false,
              preConfirm: function preConfirm() {
                var nama, jabatan, link, thumbnailFile, thumbnailBase64;
                return regeneratorRuntime.async(function preConfirm$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        nama = document.getElementById('swal-input-nama').value;
                        jabatan = document.getElementById('swal-input-jabatan').value;
                        link = document.getElementById('swal-input-link').value;
                        thumbnailFile = document.getElementById('swal-input-thumbnail').files[0];
                        thumbnailBase64 = member.thumbnail;

                        if (!thumbnailFile) {
                          _context6.next = 9;
                          break;
                        }

                        _context6.next = 8;
                        return regeneratorRuntime.awrap(convertImageToBase64(thumbnailFile));

                      case 8:
                        thumbnailBase64 = _context6.sent;

                      case 9:
                        _context6.next = 11;
                        return regeneratorRuntime.awrap((0, _firebaseDatabase.update)(memberRef, {
                          nama: nama,
                          jabatan: jabatan,
                          link: link,
                          thumbnail: thumbnailBase64
                        }));

                      case 11:
                        Swal.fire('Berhasil', 'Data anggota telah diperbarui', 'success');
                        tampilkanAnggota();

                      case 13:
                      case "end":
                        return _context6.stop();
                    }
                  }
                });
              }
            });
          }

          _context7.next = 14;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          console.error('Kesalahan mengedit anggota:', _context7.t0);

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
} // Hapus Anggota


function hapusAnggota(memberId) {
  return regeneratorRuntime.async(function hapusAnggota$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data anggota akan dihapus permanen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
          }).then(function _callee(result) {
            var database, memberRef;
            return regeneratorRuntime.async(function _callee$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!result.isConfirmed) {
                      _context8.next = 16;
                      break;
                    }

                    _context8.prev = 1;
                    _context8.next = 4;
                    return regeneratorRuntime.awrap(fetchFirebaseConfig());

                  case 4:
                    database = (0, _firebaseDatabase.getDatabase)();
                    memberRef = (0, _firebaseDatabase.ref)(database, "structure-member/".concat(memberId));
                    _context8.next = 8;
                    return regeneratorRuntime.awrap((0, _firebaseDatabase.remove)(memberRef));

                  case 8:
                    Swal.fire('Terhapus!', 'Data anggota telah dihapus.', 'success');
                    tampilkanAnggota();
                    _context8.next = 16;
                    break;

                  case 12:
                    _context8.prev = 12;
                    _context8.t0 = _context8["catch"](1);
                    Swal.fire('Kesalahan', 'Gagal menghapus data', 'error');
                    console.error('Kesalahan menghapus anggota:', _context8.t0);

                  case 16:
                  case "end":
                    return _context8.stop();
                }
              }
            }, null, null, [[1, 12]]);
          });

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
} // Event Listener untuk Tombol Tambah Anggota


document.getElementById('add-member').addEventListener('click', function () {
  Swal.fire({
    title: 'Tambah Anggota Baru',
    html: "\n            <input id=\"swal-input-nama\" class=\"swal2-input\" placeholder=\"Nama\">\n            <input id=\"swal-input-jabatan\" class=\"swal2-input\" placeholder=\"Jabatan\">\n            <input id=\"swal-input-link\" class=\"swal2-input\" placeholder=\"Link\">\n            <input type=\"file\" id=\"swal-input-thumbnail\" class=\"swal2-input\" accept=\"image/*\">\n        ",
    focusConfirm: false,
    preConfirm: function preConfirm() {
      var nama, jabatan, link, thumbnailFile, thumbnailBase64;
      return regeneratorRuntime.async(function preConfirm$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              nama = document.getElementById('swal-input-nama').value;
              jabatan = document.getElementById('swal-input-jabatan').value;
              link = document.getElementById('swal-input-link').value;
              thumbnailFile = document.getElementById('swal-input-thumbnail').files[0];

              if (!(!nama || !jabatan || !thumbnailFile || !link)) {
                _context10.next = 7;
                break;
              }

              Swal.showValidationMessage('Silakan lengkapi semua field');
              return _context10.abrupt("return", false);

            case 7:
              _context10.next = 9;
              return regeneratorRuntime.awrap(convertImageToBase64(thumbnailFile));

            case 9:
              thumbnailBase64 = _context10.sent;
              _context10.next = 12;
              return regeneratorRuntime.awrap(tambahAnggota(nama, thumbnailBase64, jabatan, link));

            case 12:
            case "end":
              return _context10.stop();
          }
        }
      });
    }
  });
}); // Ekspos fungsi ke window global

window.detailAnggota = detailAnggota;
window.editAnggota = editAnggota;
window.hapusAnggota = hapusAnggota; // Panggil fungsi tampilkan anggota saat halaman dimuat

document.addEventListener('DOMContentLoaded', function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 3:
          tampilkanAnggota();
          _context11.next = 9;
          break;

        case 6:
          _context11.prev = 6;
          _context11.t0 = _context11["catch"](0);
          console.error('Kesalahan inisialisasi:', _context11.t0);

        case 9:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 6]]);
});