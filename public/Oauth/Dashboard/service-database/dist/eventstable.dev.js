"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

var _firebaseAuth = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var firebaseApp;
var database;
var auth;

function fetchFirebaseConfig() {
  var response, config;
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
          config = _context.sent;

          if (config) {
            _context.next = 9;
            break;
          }

          throw new Error('Konfigurasi Firebase tidak valid');

        case 9:
          firebaseApp = (0, _firebaseApp.initializeApp)(config);
          database = (0, _firebaseDatabase.getDatabase)(firebaseApp);
          auth = (0, _firebaseAuth.getAuth)(firebaseApp);
          return _context.abrupt("return", database);

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error('Kesalahan mengambil konfigurasi Firebase:', _context.t0);
          throw _context.t0;

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
} // Inisialisasi Event Listener


document.addEventListener('DOMContentLoaded', function _callee2() {
  var createDataBtn;
  return regeneratorRuntime.async(function _callee2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 3:
          createDataBtn = document.getElementById('create-data');
          createDataBtn.addEventListener('click', function _callee() {
            return regeneratorRuntime.async(function _callee$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    Swal.fire({
                      title: 'Tambah Event Baru',
                      html: "\n                    <div class=\"space-y-4\">\n                        <div class=\"mb-5\">\n                            <label class=\"text-lg text-start text-xl text-black\">Judul Event : </label>\n                            <input id=\"swal-title\" class=\"block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400\" placeholder=\"Judul Event\">\n                        </div>\n                        <div class=\"mb-5\">\n                            <label class=\"text-lg text-start text-xl text-black\">Upload Thumbnail : </label>\n                            <input id=\"swal-thumbnail\" type=\"file\" class=\"block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400\" accept=\"image/*\">\n                        </div>\n                        <div class=\"mb-5\">\n                            <label class=\"text-lg text-start text-xl text-black\">Description : </label>\n                            <div id=\"editor-container\" class=\"mt-2 border border-gray-300 rounded-md bg-white p-4 shadow-sm\"></div>\n                        </div>\n                        <div class=\"mb-5\">\n                            <label class=\"text-lg text-start text-xl text-black\">Link Pendaftaran : </label>\n                            <input id=\"swal-link\" class=\"block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400\" placeholder=\"Link\">\n                        </div>\n                    </div>\n                ",
                      showCancelButton: true,
                      confirmButtonText: 'Simpan',
                      didOpen: function didOpen() {
                        var editorElement;
                        return regeneratorRuntime.async(function didOpen$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                editorElement = document.getElementById('editor-container');
                                ClassicEditor.create(editorElement, {
                                  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                                }).then(function (editor) {
                                  window.editor = editor;
                                })["catch"](function (error) {
                                  console.error(error);
                                });

                              case 2:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        });
                      },
                      preConfirm: function preConfirm() {
                        var title, thumbnailFile, description, link, base64Thumbnail, newEventRef;
                        return regeneratorRuntime.async(function preConfirm$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                title = document.getElementById('swal-title').value;
                                thumbnailFile = document.getElementById('swal-thumbnail').files[0];
                                description = window.editor.getData();
                                link = document.getElementById('swal-link').value;

                                if (!(!title || !thumbnailFile || !description || !link)) {
                                  _context3.next = 7;
                                  break;
                                }

                                Swal.showValidationMessage('Semua field harus diisi');
                                return _context3.abrupt("return");

                              case 7:
                                _context3.next = 9;
                                return regeneratorRuntime.awrap(convertImageToBase64(thumbnailFile));

                              case 9:
                                base64Thumbnail = _context3.sent;
                                // Simpan data ke Firebase
                                newEventRef = (0, _firebaseDatabase.push)((0, _firebaseDatabase.ref)(database, 'events'));
                                _context3.next = 13;
                                return regeneratorRuntime.awrap((0, _firebaseDatabase.set)(newEventRef, {
                                  title: title,
                                  thumbnail: base64Thumbnail,
                                  description: description,
                                  link: link,
                                  timestamp: (0, _firebaseDatabase.serverTimestamp)()
                                }));

                              case 13:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        });
                      }
                    }).then(function (result) {
                      if (result.isConfirmed) {
                        Swal.fire('Berhasil!', 'Data event telah disimpan', 'success');
                        fetchAndRenderEvents(); // Refresh tabel
                      }
                    });

                  case 1:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });
          fetchAndRenderEvents(); // Load data awal

          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error('Kesalahan inisialisasi:', _context5.t0);
          Swal.fire('Error!', 'Gagal menginisialisasi halaman: ' + _context5.t0.message, 'error');

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // Helper Function: Konversi Gambar ke Base64

function convertImageToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      return resolve(reader.result);
    };

    reader.onerror = function (error) {
      return reject(error);
    };
  });
} // Fungsi Fetch dan Render Events


function fetchAndRenderEvents() {
  var eventsRef = (0, _firebaseDatabase.ref)(database, 'events');
  (0, _firebaseDatabase.onValue)(eventsRef, function (snapshot) {
    var eventsData = snapshot.val();
    var tableBody = document.getElementById('table-events');
    tableBody.innerHTML = ''; // Clear existing rows

    if (eventsData) {
      Object.entries(eventsData).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            event = _ref2[1];

        var truncatedDesc = event.description.length > 30 ? event.description.substring(0, 30) + '...' : event.description;
        var row = "\n                    <tr>\n                        <td class=\"py-3 px-6 text-center\">".concat(new Date(event.timestamp).toLocaleString(), "</td>\n                        <td class=\"py-3 px-6 text-center\">").concat(event.title, "</td>\n                        <td class=\"py-3 px-6 text-center\">\n                            <img src=\"").concat(event.thumbnail, "\" alt=\"Thumbnail\" class=\"w-20 h-20 object-cover mx-auto\">\n                        </td>\n                        <td class=\"py-3 px-6 text-center\">").concat(truncatedDesc, "</td>\n                        <td class=\"py-3 px-6 text-center text-blue-500\"><a href=\"").concat(event.link, "\" target=\"_blank\">").concat(event.link, "</a></td>\n                        <td class=\"py-3 px-6 flex space-x-2\">\n                            <button onclick=\"showEventDetails('").concat(key, "')\" class=\"bg-blue-500 text-white px-3 py-1 rounded\">Detail</button>\n                            <button onclick=\"editEvent('").concat(key, "')\" class=\"bg-green-500 text-white px-3 py-1 rounded\">Edit</button>\n                            <button onclick=\"deleteEvent('").concat(key, "')\" class=\"bg-red-500 text-white px-3 py-1 rounded\">Hapus</button>\n                        </td>\n                    </tr>\n                ");
        tableBody.innerHTML += row;
      });
    }
  });
} // Fungsi Detail Event


window.showEventDetails = function _callee3(eventId) {
  var eventRef, snapshot, event;
  return regeneratorRuntime.async(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          eventRef = (0, _firebaseDatabase.ref)(database, "events/".concat(eventId));
          _context6.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseDatabase.get)(eventRef));

        case 3:
          snapshot = _context6.sent;
          event = snapshot.val();
          Swal.fire({
            title: event.title,
            html: "\n            <img src=\"".concat(event.thumbnail, "\" alt=\"Thumbnail\" class=\"w-64 h-64 object-cover mx-auto mb-4\">\n            <div class=\"text-left\">").concat(event.description, "</div>\n            <a href=\"").concat(event.link, "\" target=\"_blank\" class=\"text-blue-500\">Kunjungi Link</a>\n        "),
            showCloseButton: true
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // Fungsi Edit Event


window.editEvent = function _callee4(eventId) {
  var eventRef, snapshot, event;
  return regeneratorRuntime.async(function _callee4$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          eventRef = (0, _firebaseDatabase.ref)(database, "events/".concat(eventId));
          _context8.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseDatabase.get)(eventRef));

        case 3:
          snapshot = _context8.sent;
          event = snapshot.val();
          Swal.fire({
            title: 'Edit Event',
            html: "\n            <div class=\"space-y-4\">\n                <input id=\"swal-input-title\" \n                       class=\"block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400\" \n                       placeholder=\"Judul\" \n                       value=\"".concat(event.title, "\">\n                <div id=\"swal-input-description\" class=\"mt-2 border border-gray-300 rounded-md bg-white p-4 shadow-sm\"></div>\n                <input id=\"swal-input-link\" \n                       class=\"block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400\" \n                       placeholder=\"Link\" \n                       value=\"").concat(event.link, "\">\n            </div>\n        "),
            didOpen: function didOpen() {
              var descriptionElement = document.getElementById('swal-input-description');
              ClassicEditor.create(descriptionElement, {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
              }).then(function (editor) {
                editor.setData(event.description);
                window.editor = editor;
              })["catch"](function (error) {
                console.error(error);
              });
            },
            preConfirm: function preConfirm() {
              var updatedTitle, updatedDescription, updatedLink;
              return regeneratorRuntime.async(function preConfirm$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      updatedTitle = document.getElementById('swal-input-title').value;
                      updatedDescription = window.editor.getData();
                      updatedLink = document.getElementById('swal-input-link').value;
                      _context7.next = 5;
                      return regeneratorRuntime.awrap((0, _firebaseDatabase.update)(eventRef, {
                        title: updatedTitle,
                        description: updatedDescription,
                        link: updatedLink
                      }));

                    case 5:
                    case "end":
                      return _context7.stop();
                  }
                }
              });
            }
          }).then(function (result) {
            if (result.isConfirmed) {
              Swal.fire('Berhasil!', 'Event berhasil diperbarui.', 'success');
              fetchAndRenderEvents(); // Refresh tabel
            }
          });

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // Fungsi Delete Event


window.deleteEvent = function (eventId) {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Event ini akan dihapus secara permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!'
  }).then(function (result) {
    if (result.isConfirmed) {
      var eventRef = (0, _firebaseDatabase.ref)(database, "events/".concat(eventId));
      (0, _firebaseDatabase.remove)(eventRef).then(function () {
        Swal.fire('Dihapus!', 'Event berhasil dihapus.', 'success');
        fetchAndRenderEvents(); // Refresh tabel
      });
    }
  });
};