import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    onValue
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

class LinkDriveManager {
    constructor() {
        this.firebaseApp = null;
        this.database = null;
    }

    // Inisialisasi Firebase
    async initializeFirebase() {
        try {
            const response = await fetch('/firebase-config');
            const config = await response.json();
            
            if (!config) {
                throw new Error('Konfigurasi Firebase tidak valid');
            }
            
            this.firebaseApp = initializeApp(config);
            this.database = getDatabase(this.firebaseApp);
            
            // Langsung panggil inisialisasi UI Links
            this.initializeLinksUI();
        } catch (error) {
            console.error('Kesalahan inisialisasi Firebase:', error);
            this.showErrorMessage('Gagal memuat data');
        }
    }

    // Tampilkan pesan error
    showErrorMessage(message) {
        const linksContainer = document.getElementById('links-container');
        if (linksContainer) {
            linksContainer.innerHTML = `
                <li class="px-4 py-2 text-sm text-red-500 text-center">
                    ${message}
                </li>
            `;
        }
    }

    // Metode untuk inisialisasi UI Links
    initializeLinksUI() {
        const linksContainer = document.getElementById('links-container');
        if (!linksContainer) return;
        
        // Template untuk loading state
        const loadingTemplate = `
            <li class="animate-pulse">
                <div class="px-4 py-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </li>
            <li class="animate-pulse">
                <div class="px-4 py-2">
                    <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </li>
            <li class="animate-pulse">
                <div class="px-4 py-2">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </li>
        `;

        // Template untuk state tidak ada data
        const noDataTemplate = `
            <li class="px-4 py-2 text-sm text-gray-500 text-center">
                <div class="flex flex-col items-center justify-center space-y-2">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>Belum ada link tersedia</span>
                </div>
            </li>
        `;

        // Template untuk item link
        const linkItemTemplate = (data) => `
            <li>
                <a href="${data.link}" target="_blank" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <div class="inline-flex items-center space-x-2">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>${data.nama}</span>
                    </div>
                </a>
            </li>
        `;

        // Tampilkan loading state
        linksContainer.innerHTML = loadingTemplate;

        // Referensi ke node linkdrive
        const linksRef = ref(this.database, 'linkdrive');

        // Listener untuk data
        onValue(linksRef, (snapshot) => {
            // Periksa apakah data tersedia
            if (!snapshot.exists()) {
                linksContainer.innerHTML = noDataTemplate;
                return;
            }

            // Siapkan variabel
            let linksHTML = '';
            let linksCount = 0;

            // Urutkan data berdasarkan timestamp terbaru
            const links = [];
            snapshot.forEach((childSnapshot) => {
                links.push({
                    ...childSnapshot.val(),
                    id: childSnapshot.key
                });
            });

            // Urutkan dari yang terbaru
            links.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Render setiap link
            links.forEach(data => {
                linksHTML += linkItemTemplate(data);
                linksCount++;
            });

            // Update container
            linksContainer.innerHTML = linksHTML;

            // Update badge jumlah link jika ada
            const badge = document.getElementById('links-count');
            if (badge) {
                badge.textContent = linksCount;
            }
        }, (error) => {
            // Tangani error
            console.error('Error loading links:', error);
            this.showErrorMessage('Gagal memuat data. Silakan coba lagi nanti.');
        });
    }
}

// Inisialisasi global
const linkDriveManager = new LinkDriveManager();
window.linkDriveManager = linkDriveManager;

// Panggil inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
    linkDriveManager.initializeFirebase();
});