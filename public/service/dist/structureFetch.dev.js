"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var firebaseApp;
var database;

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
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Kesalahan mengambil konfigurasi Firebase:', _context.t0);
          throw _context.t0;

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

function fetchStructureMembers() {
  var structureDataContainer, _database, membersRef;

  return regeneratorRuntime.async(function fetchStructureMembers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          structureDataContainer = document.getElementById('structure-data'); // Loading state with pulse animation

          structureDataContainer.innerHTML = "\n       <div class=\"bg-[#03045E] rounded-lg overflow-hidden animate-pulse p-6 flex items-center space-x-4\">\n    <div class=\"w-16 h-16 bg-gray-400 rounded-full\"></div>\n    <div>\n        <div class=\"h-6 bg-gray-300 mb-4 w-3/4 rounded\"></div>\n        <div class=\"h-4 bg-gray-300 w-full rounded\"></div>\n    </div>\n</div>\n<div class=\"bg-[#03045E] rounded-lg overflow-hidden animate-pulse p-6 flex items-center space-x-4\">\n    <div class=\"w-16 h-16 bg-gray-400 rounded-full\"></div>\n    <div>\n        <div class=\"h-6 bg-gray-300 mb-4 w-3/4 rounded\"></div>\n        <div class=\"h-4 bg-gray-300 w-full rounded\"></div>\n    </div>\n</div>\n<div class=\"bg-[#03045E] rounded-lg overflow-hidden animate-pulse p-6 flex items-center space-x-4\">\n    <div class=\"w-16 h-16 bg-gray-400 rounded-full\"></div>\n    <div>\n        <div class=\"h-6 bg-gray-300 mb-4 w-3/4 rounded\"></div>\n        <div class=\"h-4 bg-gray-300 w-full rounded\"></div>\n    </div>\n</div>\n\n\n    ";
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 5:
          _database = (0, _firebaseDatabase.getDatabase)();
          membersRef = (0, _firebaseDatabase.ref)(_database, 'structure-member');
          (0, _firebaseDatabase.onValue)(membersRef, function (snapshot) {
            // Clear previous content
            structureDataContainer.innerHTML = '';
            var members = snapshot.val(); // Check if there are no members

            if (!members) {
              structureDataContainer.innerHTML = "\n                    <div class=\"col-span-full text-center text-gray-500 p-6\">\n                        Tidak ada data anggota tersedia\n                    </div>\n                ";
              return;
            } // Iterate through members and create cards


            Object.entries(members).forEach(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  id = _ref2[0],
                  member = _ref2[1];

              var memberCard = document.createElement('div');
              memberCard.className = 'bg-[#03045E] p-6 rounded-lg flex items-center space-x-4 hover:scale-105 transition-transform duration-300';
              memberCard.innerHTML = "\n                    <img src=\"".concat(member.thumbnail, "\" alt=\"").concat(member.nama, "\" class=\"w-16 h-16 rounded-lg object-cover\"/>\n                    <div>\n                        <h3 class=\"text-[#CAF0F8] font-bold text-lg\">").concat(member.nama, "</h3>\n                        <p class=\"text-white font-medium text-md\">\n                            ").concat(member.jabatan, "\n                        </p>\n                        <a href=\"").concat(member.link, "\" target=\"_blank\" class=\"text-white font-bold text-sm hover:underline\">\n                        <i class=\"fa-brands fa-instagram text-lg\"></i>\n                        ").concat(member.nama, "\n                        </a>\n                    </div>\n                ");
              structureDataContainer.appendChild(memberCard);
            });
          }, function (error) {
            console.error('Error fetching structure members:', error);
            structureDataContainer.innerHTML = "\n                <div class=\"col-span-full text-center text-red-500 p-6\">\n                    Gagal memuat data. Silakan coba lagi.\n                </div>\n            ";
          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](2);
          console.error('Initialization error:', _context2.t0);
          structureDataContainer.innerHTML = "\n            <div class=\"col-span-full text-center text-red-500 p-6\">\n                Terjadi kesalahan. Pastikan koneksi internet Anda.\n            </div>\n        ";

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 10]]);
} // Call the function when the page loads


document.addEventListener('DOMContentLoaded', fetchStructureMembers);