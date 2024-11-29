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


async function fetchStructureMembers() {
    const structureDataContainer = document.getElementById('structure-data');
    
    // Loading state with pulse animation
    structureDataContainer.innerHTML = `
       <div class="bg-[#03045E] rounded-lg overflow-hidden animate-pulse p-6 flex items-center space-x-4">
    <div class="w-16 h-16 bg-gray-400 rounded-full"></div>
    <div>
        <div class="h-6 bg-gray-300 mb-4 w-3/4 rounded"></div>
        <div class="h-4 bg-gray-300 w-full rounded"></div>
    </div>
</div>
<div class="bg-[#03045E] rounded-lg overflow-hidden animate-pulse p-6 flex items-center space-x-4">
    <div class="w-16 h-16 bg-gray-400 rounded-full"></div>
    <div>
        <div class="h-6 bg-gray-300 mb-4 w-3/4 rounded"></div>
        <div class="h-4 bg-gray-300 w-full rounded"></div>
    </div>
</div>
<div class="bg-[#03045E] rounded-lg overflow-hidden animate-pulse p-6 flex items-center space-x-4">
    <div class="w-16 h-16 bg-gray-400 rounded-full"></div>
    <div>
        <div class="h-6 bg-gray-300 mb-4 w-3/4 rounded"></div>
        <div class="h-4 bg-gray-300 w-full rounded"></div>
    </div>
</div>


    `;

    try {
        // Ensure Firebase is initialized
        await fetchFirebaseConfig();
        const database = getDatabase();
        const membersRef = ref(database, 'structure-member');

        onValue(membersRef, (snapshot) => {
            // Clear previous content
            structureDataContainer.innerHTML = '';

            const members = snapshot.val();
            
            // Check if there are no members
            if (!members) {
                structureDataContainer.innerHTML = `
                    <div class="col-span-full text-center text-gray-500 p-6">
                        Tidak ada data anggota tersedia
                    </div>
                `;
                return;
            }

            // Iterate through members and create cards
            Object.entries(members).forEach(([id, member]) => {
                const memberCard = document.createElement('div');
                memberCard.className = 'bg-[#03045E] p-6 rounded-lg flex items-center space-x-4 hover:scale-105 transition-transform duration-300';
                
                memberCard.innerHTML = `
                    <img src="${member.thumbnail}" alt="${member.nama}" class="w-16 h-16 rounded-lg object-cover"/>
                    <div>
                        <h3 class="text-[#CAF0F8] font-bold text-lg">${member.nama}</h3>
                        <p class="text-white font-medium text-md">
                            ${member.jabatan}
                        </p>
                        <a href="https://instagram.com/${member.link}" target="_blank" class="text-white font-bold text-sm hover:underline">
                        <i class="fa-brands fa-instagram text-lg"></i>
                        ${member.link}
                        </a>
                    </div>
                `;
// revisi perubahan link
                structureDataContainer.appendChild(memberCard);
            });
        }, (error) => {
            console.error('Error fetching structure members:', error);
            structureDataContainer.innerHTML = `
                <div class="col-span-full text-center text-red-500 p-6">
                    Gagal memuat data. Silakan coba lagi.
                </div>
            `;
        });
    } catch (error) {
        console.error('Initialization error:', error);
        structureDataContainer.innerHTML = `
            <div class="col-span-full text-center text-red-500 p-6">
                Terjadi kesalahan. Pastikan koneksi internet Anda.
            </div>
        `;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchStructureMembers);