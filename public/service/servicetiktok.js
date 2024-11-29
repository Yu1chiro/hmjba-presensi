async function fetchTikTokVideos() {
    try {
      // Menampilkan loading state
      const tiktokVideosContainer = document.getElementById('tiktok-videos');
      tiktokVideosContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="relative pb-[56.25%] overflow-hidden bg-gray-300"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-300 rounded mb-2"></div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-300 rounded w-1/3"></div>
              <div class="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="relative pb-[56.25%] overflow-hidden bg-gray-300"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-300 rounded mb-2"></div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-300 rounded w-1/3"></div>
              <div class="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="relative pb-[56.25%] overflow-hidden bg-gray-300"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-300 rounded mb-2"></div>
            <div class="flex justify-between items-center">
              <div class="h-4 bg-gray-300 rounded w-1/3"></div>
              <div class="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      `;
  
      const response = await fetch('/service/tiktok.json');
      
      // Periksa apakah respons berhasil
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const videos = await response.json();
      tiktokVideosContainer.innerHTML = ''; // Menghapus placeholder
  
      videos.forEach(video => {
        try {
          const videoElement = document.createElement('div');
          videoElement.className = 'bg-white rounded-lg shadow-md overflow-hidden';
          
          // Membuat struktur HTML berdasarkan template baru
          videoElement.innerHTML = `
            <div class="relative pb-[56.25%] overflow-hidden">
                <img 
                    src="${video.thumbnail}" 
                    alt="Thumbnail Video" 
                    class="absolute inset-0 w-full h-full object-cover"
                >
            </div>
            <div class="p-4">
                <p class="mt-4 text-sm text-gray-600">
                    ${video.description.length > 200 ? video.description.substring(0, 200) + '...' : video.description}
                </p>
                <div class="flex justify-between items-center">
                    <a 
                        href="${video.link}" 
                        target="_blank" 
                        class="bg-blue-500 text-white px-2 py-2 rounded-lg text-sm mt-2 hover:bg-blue-700"
                    >
                    <i class="fa-brands fa-tiktok me-1"></i>
                        Tonton Video
                    </a>
                </div>
            </div>
          `;
          
          // Menambahkan card video ke container
          tiktokVideosContainer.appendChild(videoElement);
      
        } catch (error) {
          console.error('Error fetching TikTok videos:', error.message);
        }
      });
      
      
    } catch (error) {
      console.error('Error fetching TikTok videos:', error.message);
    }
  }
  
  fetchTikTokVideos();
  