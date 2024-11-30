import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    onValue 
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

let firebaseApp;
let database;

async function fetchFirebaseConfig() {
    try {
        const response = await fetch('/firebase-config');
        const config = await response.json();

        if (!config) {
            throw new Error('Konfigurasi Firebase tidak valid');
        }

        firebaseApp = initializeApp(config);
        database = getDatabase(firebaseApp);
    } catch (error) {
        console.error('Kesalahan mengambil konfigurasi Firebase:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchFirebaseConfig();
        const eventsContainer = document.getElementById('events');
        const loadingState = document.createElement('p');
        loadingState.innerHTML = `
    <!-- Left Content -->
    <div class="md:w-1/2 text-white space-y-6">
        <div class="bg-gray-700 h-8 w-3/4 rounded mb-4"></div>
        <div class="block bg-gray-300 w-full p-3 rounded-lg mb-3 lg:hidden md:hidden flex justify-center">
            <div class="bg-gray-400 rounded-lg w-[550px] h-[300px]"></div>
        </div>
        <div class="bg-gray-600 h-4 w-full rounded mb-2"></div>
        <div class="bg-gray-600 h-4 w-5/6 rounded"></div>
        <div class="flex flex-wrap space-x-4 pt-4">
            <div class="bg-gray-800 w-20 h-8 rounded"></div>
        </div>
    </div>

    <!-- Right Content (Logo) -->
    <div class="lg:w-1/2 flex hidden lg:block md:block justify-end mt-8 lg:mt-0 lg:pl-8">
        <div class="bg-gray-300 rounded-lg p-5 w-[550px] lg:w-[450px] md:w-[350px] h-[300px] flex items-center justify-center transform lg:translate-x-4"></div>
    </div>

`;
        loadingState.className = 'text-center text-white py-4';
        eventsContainer.appendChild(loadingState);

        const eventsRef = ref(database, '/events');
        onValue(eventsRef, (snapshot) => {
            const eventsData = snapshot.val();
            eventsContainer.innerHTML = ''; // Bersihkan kontainer

            if (!eventsData) {
                const noDataMessage = document.createElement('p');
                noDataMessage.innerHTML = `<div class="text-center text-white space-y-6" bis_skin_checked="1">
            <i class="fas fa-calendar-xmark text-6xl text-[#FB8500] mb-4"></i>
            <h1 class="text-2xl sm:text-3xl  font-bold">
                Belum ada Informasi
            </h1>
            <p class="text-lg">
            Silahkan tunggu informasi selanjutnya ya!
            </p>
        </div>`;
                noDataMessage.className = 'text-center text-white py-4';
                eventsContainer.appendChild(noDataMessage);
                return;
            }

            Object.values(eventsData).forEach((event) => {
                const eventElement = document.createElement('div');
                eventElement.className = 'flex flex-col md:flex-row items-center py-12 justify-between space-y-6';

                eventElement.innerHTML = `
                    <!-- Left Content -->
                    <div class="md:w-1/2 text-white space-y-6">
                        <h1 class="text-3xl sm:text-3xl font-bold mb-4">
                            Information <span class="text-3xl font-bold text-[#F2C103]">${event.title}</span>
                        </h1>
                        <div data-aos="zoom-in" class="block bg-white w-full p-3 rounded-lg mb-3 lg:hidden md:hidden flex justify-center">
                            <img src="${event.thumbnail}" class="rounded-lg w-[550px] h-full object-cover" alt="${event.title}">
                        </div>
                        <p data-aos="fade-up" class="text-md text-justify leading-relaxed">
                            ${event.description}
                        </p>
                        <div class="flex flex-wrap space-x-4 pt-4">
                            <a data-aos="zoom-in" href="${event.link}" class="bg-green-500 hover:bg-green-700 transition-colors duration-300 px-4 py-2 rounded-lg font-bold"> 
                                Daftar
                            </a>
                        </div>
                    </div>

                    <!-- Right Content (Logo) -->
                    <div data-aos="zoom-in" class="lg:w-1/2 flex hidden lg:block md:block justify-end mt-8 lg:mt-0 lg:pl-8">
                        <div class="bg-white rounded-lg p-5 w-[550px] lg:w-[450px] md:w-[350px] h-full flex items-center justify-center transform lg:translate-x-4">
                            <img src="${event.thumbnail}" class="rounded-lg w-full h-full object-cover" alt="${event.title}">
                        </div>
                    </div>
                `;
// memperbaiki UI 
                eventsContainer.appendChild(eventElement);
            });
        });
    } catch (error) {
        console.error('Kesalahan memuat halaman:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Gagal memuat data. Silakan coba lagi nanti.';
        errorMessage.className = 'text-center text-red-500 py-4';
        eventsContainer.appendChild(errorMessage);
    }
});
