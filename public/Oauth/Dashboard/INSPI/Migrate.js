
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

const initializeFirebase = (firebaseConfig) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    return database;
};

// Fungsi utama yang dijalankan saat DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Mengambil konfigurasi Firebase dari server dan menginisialisasi Firebase
    fetch('/firebase-config')
        .then(response => response.json())
        .then(config => {
            const database = initializeFirebase(config);
            initializeAppFunctions(database);
        })
        .catch(error => {
            console.error('Gagal mengambil konfigurasi Firebase:', error);
        });
});

// Fungsi untuk menginisialisasi fungsi-fungsi lain setelah Firebase siap
const initializeAppFunctions = (database) => {

    const dbRef = ref(database, 'migrate-data');
    function downloadExcel(presensiData) {
        if (presensiData && presensiData.data) {
            const extractedData = [];
            
            // Ekstrak data dari struktur presensiData
            Object.keys(presensiData.data).forEach(key => {
                const studentData = presensiData.data[key];
                extractedData.push({
                    WAKTU: studentData.timestamp ? formatTimestamp(studentData.timestamp) : 'N/A',
                    NAMA: studentData.nama || studentData.name || 'N/A',
                    NIM: studentData.nim || key,
                    PRODI: studentData.programStudi || studentData.prodi || 'N/A',
                    JABATAN: studentData.jabatan || studentData.Jabatan || 'N/A',
                    KETERANGAN: studentData.status || studentData.keterangan || 'N/A',
                    ALASAN: studentData.alasan || ''
                });
            });
    
            if (extractedData.length > 0) {
                // Buat worksheet dari data yang diekstrak
                const worksheet = XLSX.utils.json_to_sheet(extractedData);
                
                // Buat workbook baru
                const workbook = XLSX.utils.book_new();
                
                // Gunakan judul dari database untuk nama worksheet
                const worksheetName = presensiData.judul || "Data Presensi";
                XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
    
                // Gunakan judul dari database untuk nama file
                const fileName = `${presensiData.judul || 'Data-Presensi'}.xlsx`;
    
                // Gunakan writeFile untuk mengunduh file Excel
                XLSX.writeFile(workbook, fileName);
    
                // Notifikasi setelah file berhasil diunduh
                Swal.fire({
                    title: "Download Excel Berhasil!",
                    icon: "success",
                    text: `File ${fileName} telah berhasil diunduh.`,
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Tidak ada data untuk diunduh.",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Error",
                text: "Struktur data tidak valid atau tidak ada data untuk diunduh.",
                icon: "error"
            });
        }
    }
    
    // Fungsi untuk memformat timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('id-ID', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    // Mengambil semua data secara real-time menggunakan onValue
    // Function to delete data
    function deleteData(key) {
        const itemRef = ref(database, `migrate-data/${key}`);
        remove(itemRef).then(() => {
            console.log("Data deleted successfully");
            Swal.fire({
                title: "Data Deleted",
                text: "The selected data has been successfully deleted.",
                icon: "success"
            });
        }).catch((error) => {
            console.error("Error deleting data:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while deleting the data. Please try again.",
                icon: "error"
            });
        });
    }
    
    // Fetch all data in real-time using onValue
    onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const cardContainer = document.getElementById('card-data');
            cardContainer.innerHTML = '';
    
            Object.keys(data).forEach((key) => {
                const item = data[key];
                const card = document.createElement('div');
                card.className = 'card max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700';
                card.innerHTML = `
                    <h5 id="title" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${item.judul}</h5>
                    <p id="date" class="mb-3 font-normal text-gray-700 dark:text-gray-400">${item.tanggal}</p>
                    <a href="#" id="downloadBtn-${key}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Download
                        <svg style="margin:0 2px" class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"/>
                        </svg>
                    </a>
                    <a href="#" id="deleteBtn-${key}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete Data</a>
                `;
    
                cardContainer.appendChild(card);
    
                // Event listener for download button
                document.getElementById(`downloadBtn-${key}`).addEventListener('click', function (e) {
                    e.preventDefault();
                    downloadExcel(item);
                });
    
                // Event listener for delete button
                document.getElementById(`deleteBtn-${key}`).addEventListener('click', function (e) {
                    e.preventDefault();
                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteData(key);
                        }
                    });
                });
            });
        } else {
            console.log("Data not available");
        }
    }, (error) => {
        console.error("Error fetching data:", error);
    });
};


// Referensi ke data di Firebase