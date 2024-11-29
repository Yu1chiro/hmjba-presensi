"use strict";

function fetchYoutubeRSSFeed() {
  var channelId, rssFeedUrl, youtubeContainer, proxyUrls, response, _i, _proxyUrls, proxyUrl, xmlText, parser, xmlDoc, entries, maxVideos, index, entry, videoId, title, published, videoElement;

  return regeneratorRuntime.async(function fetchYoutubeRSSFeed$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Ganti dengan Channel ID Anda
          channelId = 'UCZh1e9v6pMA0eoDKmLyUQRQ'; // ID Channel @hmjforeignlanguageundiksha5688

          rssFeedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=".concat(channelId);
          youtubeContainer = document.getElementById('youtube'); // Tampilkan loading state

          youtubeContainer.innerHTML = "\n        ".concat([1, 2, 3, 4, 5, 6, 7, 8].map(function () {
            return "\n        <div class=\"bg-white rounded-lg shadow-md overflow-hidden animate-pulse\">\n            <div class=\"relative pb-[56.25%] overflow-hidden bg-gray-300\">\n                <!-- Placeholder untuk thumbnail -->\n            </div>\n            <div class=\"p-4\">\n                <div class=\"h-6 bg-gray-300 rounded mb-2\"></div>\n                <div class=\"flex justify-between items-center\">\n                    <div class=\"h-4 bg-gray-300 rounded w-1/3\"></div>\n                    <div class=\"h-8 bg-gray-300 rounded w-16\"></div>\n                </div>\n            </div>\n        </div>\n        ";
          }).join(''), "\n    ");
          _context.prev = 4;
          // Coba berbagai proxy
          proxyUrls = ["https://api.allorigins.win/raw?url=".concat(encodeURIComponent(rssFeedUrl)), "https://cors-anywhere.herokuapp.com/".concat(rssFeedUrl)];
          _i = 0, _proxyUrls = proxyUrls;

        case 7:
          if (!(_i < _proxyUrls.length)) {
            _context.next = 23;
            break;
          }

          proxyUrl = _proxyUrls[_i];
          _context.prev = 9;
          _context.next = 12;
          return regeneratorRuntime.awrap(fetch(proxyUrl));

        case 12:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("break", 23);

        case 15:
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](9);
          console.log('Proxy gagal:', _context.t0);

        case 20:
          _i++;
          _context.next = 7;
          break;

        case 23:
          if (!(!response || !response.ok)) {
            _context.next = 25;
            break;
          }

          throw new Error('Semua proxy gagal');

        case 25:
          _context.next = 27;
          return regeneratorRuntime.awrap(response.text());

        case 27:
          xmlText = _context.sent;
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(xmlText, "text/xml");
          entries = xmlDoc.querySelectorAll('entry'); // Bersihkan container dan tampilkan video

          youtubeContainer.innerHTML = ''; // Batasi jumlah video menjadi 12 atau sejumlah entry yang tersedia

          maxVideos = Math.min(12, entries.length);

          for (index = 0; index < maxVideos; index++) {
            entry = entries[index];
            videoId = entry.querySelector('videoId').textContent;
            title = entry.querySelector('title').textContent;
            published = entry.querySelector('published').textContent;
            videoElement = document.createElement('div');
            videoElement.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            videoElement.innerHTML = "\n                <div class=\"relative pb-[56.25%] overflow-hidden\">\n                    <img \n                        src=\"https://img.youtube.com/vi/".concat(videoId, "/maxresdefault.jpg\" \n                        alt=\"").concat(title, "\" \n                        class=\"absolute inset-0 w-full h-full object-cover\"\n                    >\n                </div>\n                <div class=\"p-4\">\n                    <h3 class=\"font-bold text-lg mb-2\">").concat(title, "</h3>\n                    <div class=\"flex justify-between items-center\">\n                        <span class=\"text-sm text-gray-500\">\n                        <i class=\"fa-solid fa-calendar-days text-sm me-1\" style=\"color:black;\"></i>\n                            ").concat(new Date(published).toLocaleDateString(), "\n                        </span>\n                        <a \n                            href=\"https://www.youtube.com/watch?v=").concat(videoId, "\" \n                            target=\"_blank\" \n                            class=\"bg-red-500 text-white px-3 py-1 rounded-full text-sm\"\n                        >\n                            <i class=\"fa-brands fa-youtube text-lg me-1\"></i>\n                            Watch\n                        </a>\n                    </div>\n                </div>\n            ");
            youtubeContainer.appendChild(videoElement);
          }

          _context.next = 40;
          break;

        case 36:
          _context.prev = 36;
          _context.t1 = _context["catch"](4);
          console.error('Error fetching YouTube videos:', _context.t1);
          youtubeContainer.innerHTML = "\n            <div class=\"col-span-full text-center text-red-500\">\n                Gagal memuat video: ".concat(_context.t1.message, "\n            </div>\n        ");

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 36], [9, 17]]);
} // Panggil fungsi saat halaman dimuat


document.addEventListener('DOMContentLoaded', function () {
  fetchYoutubeRSSFeed(); // Refresh otomatis setiap 30 menit

  setInterval(fetchYoutubeRSSFeed, 30 * 60 * 1000);
});