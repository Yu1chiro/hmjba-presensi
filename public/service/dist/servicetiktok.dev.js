"use strict";

function fetchTikTokVideos() {
  var tiktokVideosContainer, response, videos;
  return regeneratorRuntime.async(function fetchTikTokVideos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Menampilkan loading state
          tiktokVideosContainer = document.getElementById('tiktok-videos');
          tiktokVideosContainer.innerHTML = "\n        <div class=\"bg-white rounded-lg shadow-md overflow-hidden animate-pulse\">\n          <div class=\"relative pb-[56.25%] overflow-hidden bg-gray-300\"></div>\n          <div class=\"p-4\">\n            <div class=\"h-6 bg-gray-300 rounded mb-2\"></div>\n            <div class=\"flex justify-between items-center\">\n              <div class=\"h-4 bg-gray-300 rounded w-1/3\"></div>\n              <div class=\"h-8 bg-gray-300 rounded w-16\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"bg-white rounded-lg shadow-md overflow-hidden animate-pulse\">\n          <div class=\"relative pb-[56.25%] overflow-hidden bg-gray-300\"></div>\n          <div class=\"p-4\">\n            <div class=\"h-6 bg-gray-300 rounded mb-2\"></div>\n            <div class=\"flex justify-between items-center\">\n              <div class=\"h-4 bg-gray-300 rounded w-1/3\"></div>\n              <div class=\"h-8 bg-gray-300 rounded w-16\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"bg-white rounded-lg shadow-md overflow-hidden animate-pulse\">\n          <div class=\"relative pb-[56.25%] overflow-hidden bg-gray-300\"></div>\n          <div class=\"p-4\">\n            <div class=\"h-6 bg-gray-300 rounded mb-2\"></div>\n            <div class=\"flex justify-between items-center\">\n              <div class=\"h-4 bg-gray-300 rounded w-1/3\"></div>\n              <div class=\"h-8 bg-gray-300 rounded w-16\"></div>\n            </div>\n          </div>\n        </div>\n      ";
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch('/service/tiktok.json'));

        case 5:
          response = _context.sent;

          if (response.ok) {
            _context.next = 8;
            break;
          }

          throw new Error("HTTP error! Status: ".concat(response.status));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          videos = _context.sent;
          tiktokVideosContainer.innerHTML = ''; // Menghapus placeholder

          videos.forEach(function (video) {
            try {
              var videoElement = document.createElement('div');
              videoElement.className = 'bg-white rounded-lg shadow-md overflow-hidden'; // Membuat struktur HTML berdasarkan template baru

              videoElement.innerHTML = "\n            <div class=\"relative pb-[56.25%] overflow-hidden\">\n                <img \n                    src=\"".concat(video.thumbnail, "\" \n                    alt=\"Thumbnail Video\" \n                    class=\"absolute inset-0 w-full h-full object-cover\"\n                >\n            </div>\n            <div class=\"p-4\">\n                <p class=\"mt-4 text-sm text-gray-600\">\n                    ").concat(video.description.length > 200 ? video.description.substring(0, 200) + '...' : video.description, "\n                </p>\n                <div class=\"flex justify-between items-center\">\n                    <a \n                        href=\"").concat(video.link, "\" \n                        target=\"_blank\" \n                        class=\"bg-blue-500 text-white px-2 py-2 rounded-lg text-sm mt-2 hover:bg-blue-700\"\n                    >\n                    <i class=\"fa-brands fa-tiktok me-1\"></i>\n                        Tonton Video\n                    </a>\n                </div>\n            </div>\n          "); // Menambahkan card video ke container

              tiktokVideosContainer.appendChild(videoElement);
            } catch (error) {
              console.error('Error fetching TikTok videos:', error.message);
            }
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching TikTok videos:', _context.t0.message);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}

fetchTikTokVideos();