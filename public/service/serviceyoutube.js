async function fetchYoutubeRSSFeed() {
    // Ganti dengan Channel ID Anda
    const channelId = 'UCZh1e9v6pMA0eoDKmLyUQRQ'; // ID Channel @hmjforeignlanguageundiksha5688
    const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const youtubeContainer = document.getElementById('youtube');
    
    // Tampilkan loading state
    youtubeContainer.innerHTML = `
        ${[1, 2, 3, 4, 5, 6, 7, 8].map(() => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div class="relative pb-[56.25%] overflow-hidden bg-gray-300">
                <!-- Placeholder untuk thumbnail -->
            </div>
            <div class="p-4">
                <div class="h-6 bg-gray-300 rounded mb-2"></div>
                <div class="flex justify-between items-center">
                    <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div class="h-8 bg-gray-300 rounded w-16"></div>
                </div>
            </div>
        </div>
        `).join('')}
    `;

    try {
        // Coba berbagai proxy
        const proxyUrls = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(rssFeedUrl)}`,
            `https://cors-anywhere.herokuapp.com/${rssFeedUrl}`
        ];

        let response;
        for (let proxyUrl of proxyUrls) {
            try {
                response = await fetch(proxyUrl);
                if (response.ok) break;
            } catch (proxyError) {
                console.log('Proxy gagal:', proxyError);
            }
        }

        if (!response || !response.ok) {
            throw new Error('Semua proxy gagal');
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const entries = xmlDoc.querySelectorAll('entry');

        // Bersihkan container dan tampilkan video
        youtubeContainer.innerHTML = '';

        // Batasi jumlah video menjadi 12 atau sejumlah entry yang tersedia
        const maxVideos = Math.min(12, entries.length);

        for (let index = 0; index < maxVideos; index++) {
            const entry = entries[index];
            const videoId = entry.querySelector('videoId').textContent;
            const title = entry.querySelector('title').textContent;
            const published = entry.querySelector('published').textContent;

            const videoElement = document.createElement('div');
            videoElement.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            videoElement.innerHTML = `
                <div class="relative pb-[56.25%] overflow-hidden">
                    <img 
                        src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                        alt="${title}" 
                        class="absolute inset-0 w-full h-full object-cover"
                    >
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${title}</h3>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">
                        <i class="fa-solid fa-calendar-days text-sm me-1" style="color:black;"></i>
                            ${new Date(published).toLocaleDateString()}
                        </span>
                        <a 
                            href="https://www.youtube.com/watch?v=${videoId}" 
                            target="_blank" 
                            class="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                        >
                            <i class="fa-brands fa-youtube text-lg me-1"></i>
                            Watch
                        </a>
                    </div>
                </div>
            `;

            youtubeContainer.appendChild(videoElement);
        }
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        youtubeContainer.innerHTML = `
            <div class="col-span-full text-center text-red-500">
                Gagal memuat video: ${error.message}
            </div>
        `;
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchYoutubeRSSFeed();
    
    // Refresh otomatis setiap 30 menit
    setInterval(fetchYoutubeRSSFeed, 30 * 60 * 1000);
});