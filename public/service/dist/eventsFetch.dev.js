"use strict";

var _firebaseApp = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js");

var _firebaseDatabase = require("https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js");

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

document.addEventListener('DOMContentLoaded', function _callee() {
  var _eventsContainer, loadingState, eventsRef, errorMessage;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetchFirebaseConfig());

        case 3:
          _eventsContainer = document.getElementById('events');
          loadingState = document.createElement('p');
          loadingState.innerHTML = "\n    <!-- Left Content -->\n    <div class=\"md:w-1/2 text-white space-y-6\">\n        <div class=\"bg-gray-700 h-8 w-3/4 rounded mb-4\"></div>\n        <div class=\"block bg-gray-300 w-full p-3 rounded-lg mb-3 lg:hidden md:hidden flex justify-center\">\n            <div class=\"bg-gray-400 rounded-lg w-[550px] h-[300px]\"></div>\n        </div>\n        <div class=\"bg-gray-600 h-4 w-full rounded mb-2\"></div>\n        <div class=\"bg-gray-600 h-4 w-5/6 rounded\"></div>\n        <div class=\"flex flex-wrap space-x-4 pt-4\">\n            <div class=\"bg-gray-800 w-20 h-8 rounded\"></div>\n        </div>\n    </div>\n\n    <!-- Right Content (Logo) -->\n    <div class=\"lg:w-1/2 flex hidden lg:block md:block justify-end mt-8 lg:mt-0 lg:pl-8\">\n        <div class=\"bg-gray-300 rounded-lg p-5 w-[550px] lg:w-[450px] md:w-[350px] h-[300px] flex items-center justify-center transform lg:translate-x-4\"></div>\n    </div>\n\n";
          loadingState.className = 'text-center text-white py-4';

          _eventsContainer.appendChild(loadingState);

          eventsRef = (0, _firebaseDatabase.ref)(database, '/events');
          (0, _firebaseDatabase.onValue)(eventsRef, function (snapshot) {
            var eventsData = snapshot.val();
            _eventsContainer.innerHTML = ''; // Bersihkan kontainer

            if (!eventsData) {
              var noDataMessage = document.createElement('p');
              noDataMessage.innerHTML = "<div class=\"text-center text-white space-y-6\" bis_skin_checked=\"1\">\n            <i class=\"fas fa-calendar-xmark text-6xl text-[#FB8500] mb-4\"></i>\n            <h1 class=\"text-2xl sm:text-3xl  font-bold\">\n                Belum ada Informasi\n            </h1>\n            <p class=\"text-lg\">\n            Silahkan tunggu informasi selanjutnya ya!\n            </p>\n        </div>";
              noDataMessage.className = 'text-center text-white py-4';

              _eventsContainer.appendChild(noDataMessage);

              return;
            }

            Object.values(eventsData).forEach(function (event) {
              var eventElement = document.createElement('div');
              eventElement.className = 'flex flex-col md:flex-row items-center py-12 justify-between space-y-6';
              eventElement.innerHTML = "\n                    <!-- Left Content -->\n                    <div class=\"md:w-1/2 text-white space-y-6\">\n                        <h1 class=\"text-3xl sm:text-3xl font-bold mb-4\">\n                            Information <span class=\"text-3xl font-bold text-[#F2C103]\">".concat(event.title, "</span>\n                        </h1>\n                        <div data-aos=\"zoom-in\" class=\"block bg-white w-full p-3 rounded-lg mb-3 lg:hidden md:hidden flex justify-center\">\n                            <img src=\"").concat(event.thumbnail, "\" class=\"rounded-lg w-[550px] h-full object-cover\" alt=\"").concat(event.title, "\">\n                        </div>\n                        <p data-aos=\"fade-up\" class=\"text-md text-justify leading-relaxed\">\n                            ").concat(event.description, "\n                        </p>\n                        <div class=\"flex flex-wrap space-x-4 pt-4\">\n                            <a data-aos=\"zoom-in\" href=\"").concat(event.link, "\" class=\"bg-green-500 hover:bg-green-700 transition-colors duration-300 px-4 py-2 rounded-lg font-bold\"> \n                                Daftar\n                            </a>\n                        </div>\n                    </div>\n\n                    <!-- Right Content (Logo) -->\n                    <div data-aos=\"zoom-in\" class=\"lg:w-1/2 flex hidden lg:block md:block justify-end mt-8 lg:mt-0 lg:pl-8\">\n                        <div class=\"bg-white rounded-lg p-5 w-[550px] lg:w-[450px] md:w-[350px] h-full flex items-center justify-center transform lg:translate-x-4\">\n                            <img src=\"").concat(event.thumbnail, "\" class=\"rounded-lg w-full h-full object-cover\" alt=\"").concat(event.title, "\">\n                        </div>\n                    </div>\n                "); // memperbaiki UI 

              _eventsContainer.appendChild(eventElement);
            });
          });
          _context2.next = 19;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('Kesalahan memuat halaman:', _context2.t0);
          errorMessage = document.createElement('p');
          errorMessage.textContent = 'Gagal memuat data. Silakan coba lagi nanti.';
          errorMessage.className = 'text-center text-red-500 py-4';
          eventsContainer.appendChild(errorMessage);

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});