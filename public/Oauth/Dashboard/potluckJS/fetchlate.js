// public/interface.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, set, get, onChildAdded, onChildRemoved, remove } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

const initializeFirebase = (firebaseConfig) => {
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    return database; 
};

document.addEventListener('DOMContentLoaded', () => {
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

const initializeAppFunctions = (database) => {

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Fungsi untuk menghapus semua data dari 'Inspi-Telat'
    const removeAllData = async () => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Semua data akan dihapus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus semua!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const dataRef = ref(database, 'Potluck-Telat');
                try {
                    await set(dataRef, null);
                    Swal.fire({
                        icon: 'success',
                        title: 'Data Berhasil di Hapus',
                    });
                } catch (error) {
                    console.error("Error removing all data from database", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Terjadi Kesalahan',
                        text: 'Terjadi kesalahan saat menghapus semua data.',
                    });
                }
            }
        });
    };

    // Tambahkan event listener untuk tombol 'remove-all2' jika ada
    const removeAllButton = document.getElementById("remove-all2");
    if (removeAllButton) {
        removeAllButton.addEventListener("click", removeAllData);
    } else {
        console.warn("Element dengan ID 'remove-all2' tidak ditemukan.");
    }

    ///// FETCHING

    // Fungsi untuk mengekstrak data dan meng-export ke Excel
    const extractTambahan = async () => {
        const dataRef = ref(database, 'Potluck-Telat');

        try {
            const snapshot = await get(dataRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const extractedData = [];

                Object.keys(data).forEach(key => {
                    const item = data[key];
                    extractedData.push({
                        NAMA: item.nama,
                        NIM: item.nim,
                        PRODI: item.programStudi,
                        KELAS: item.kelas,
                        KETERANGAN: item.status,
                        ALASAN: item.alasan
                    });
                });

                const worksheet = XLSX.utils.json_to_sheet(extractedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Potluck-Telat");

                XLSX.writeFile(workbook, "POTLUCK-TELAT.xlsx");
                Swal.fire({
                    title: "Export Excel Success",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: "Data Kosong!",
                    icon: "warning"
                });
            }
        } catch (error) {
            console.error("Error extracting data from database", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Terjadi kesalahan saat mengekstrak data.',
            });
        }
    };

    // Tambahkan event listener untuk tombol 'extract-tambahan' jika ada
    const extractButton = document.getElementById("extract-tambahan");
    if (extractButton) {
        extractButton.addEventListener("click", extractTambahan);
    } else {
        console.warn("Element dengan ID 'extract-tambahan' tidak ditemukan.");
    }

    // Fungsi untuk menambahkan data ke tabel saat ada penambahan child
    const dataRef = ref(database, 'Potluck-Telat');
    onChildAdded(dataRef, (snapshot) => {
        const data = snapshot.val();
        const nim = snapshot.key;

        const row = document.createElement('tr');
        row.setAttribute('id', `row-${nim}`); // tambahkan id untuk setiap baris
        row.innerHTML = `
            <td class="text-center text-black px-3 py-2">${formatTimestamp(data.timestamp)}</td>
            <td class="text-center text-black px-3 py-2">${data.nama}</td>
            <td class="text-center text-black px-3 py-2">${nim}</td>
            <td class="text-center text-black px-3 py-2">${data.programStudi}</td>
            <td class="text-center text-black px-3 py-2">${data.kelas}</td>
            <td class="text-center text-black px-3 py-2">${data.status}</td>
            <td class="text-start text-black px-3 py-2">${data.alasan}</td>
            <td class="text-center">
                <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onclick="hapusData('${nim}')">Hapus</button>
            </td>
        `;

        const tableBody = document.getElementById('Potluck-Telat');
        if (tableBody) {
            tableBody.appendChild(row);
        } else {
            console.error("Element dengan ID 'Inspi-Telat' tidak ditemukan.");
        }
    });

    // Tambahkan listener untuk event child_removed
    onChildRemoved(dataRef, (snapshot) => {
        const nim = snapshot.key;
        const rowToRemove = document.getElementById(`row-${nim}`);
        if (rowToRemove) {
            rowToRemove.remove(); // hapus elemen HTML dari tabel
        }
    });

    // Fungsi untuk menghapus data berdasarkan nim
    function hapusData(nim) {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data ini akan dihapus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                remove(ref(database, `Potluck-Telat/${nim}`))
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Data Berhasil Dihapus',
                        });
                    })
                    .catch((error) => {
                        console.error("Error removing data:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Terjadi Kesalahan',
                            text: 'Gagal menghapus data.',
                        });
                    });
            }
        });
    }

    // Pastikan fungsi hapusData tersedia di cakupan global
    window.hapusData = hapusData;
};
