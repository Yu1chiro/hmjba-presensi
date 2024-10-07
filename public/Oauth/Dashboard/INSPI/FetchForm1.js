import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, get, remove, onValue, set } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
import { push } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
// Konfigurasi Firebase
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

    // Fungsi untuk memformat timestamp menjadi format yang mudah dibaca
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
    // Fungsi untuk menghapus data berdasarkan NIM
    // Fungsi untuk menghapus semua data dari Firebase
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
                const dataRef = ref(database, 'Presensi-Inspi');
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
    // Fungsi untuk menghapus data dari Firebase
    const removeData = async (nim) => {
        const dataRef = ref(database, 'Presensi-Inspi/' + nim);
        try {
            await remove(dataRef);
            alert("Remove Data Success");
            fetchData(); // Refresh tabel setelah data dihapus
        } catch (error) {
            console.error("Error removing data from database", error);
            alert("Terjadi kesalahan saat menghapus data.");
        }
    };
    
    // Pastikan fungsi removeData tersedia di cakupan global
    window.removeData = removeData;
    // Fungsi untuk fetching data dari Firebase dan menampilkannya dalam tabel
    const fetchData = async () => {
        const dataTable = document.getElementById("table-body");
        const dataRef = ref(database, 'Presensi-Inspi');
    
        try {
            const snapshot = await get(dataRef);
    
            if (snapshot.exists()) {
                const data = snapshot.val();
                dataTable.innerHTML = ""; // Kosongkan tabel sebelum mengisi data
    
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const row = document.createElement("tr");
    
                    row.innerHTML = `
                        <td class="text-center text-sm px-2">${formatTimestamp(item.timestamp)}</td>
                        <td class="text-center text-sm px-2">${item.name}</td>
                        <td class="text-center text-sm px-2">${item.nim}</td>
                        <td class="text-center text-sm px-2">${item.prodi}</td>
                        <td class="text-center text-sm px-2">${item.jabatan}</td>
                        <td class="text-center text-sm px-2">${item.keterangan}</td>
                        <td class="text-center text-white"><a class="text-green-600 font-bold" href="https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}" target="_blank">Lihat Lokasi</a></td>
                        <td class="text-center text-sm px-2 py-2">${item.deviceName}</td>
                         <td class="text-center"><button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"  onclick="removeData('${item.nim}')">Remove</button></td>
                    `;
    
                    dataTable.appendChild(row);
                });
            } else {
                dataTable.innerHTML = "<tr><td colspan='8' class='text-red-600 font-bold text-center' >Tidak Ada Data Yang Tersedia, Data Telah Dihapus/Dipindahkan ke Migrate Database</td></tr>";
            }
        } catch (error) {
            console.error("Error fetching data from database", error);
            dataTable.innerHTML = "<tr><td colspan='6' class='text-center'>Terjadi kesalahan saat mengambil data</td></tr>";
        }
    };
    
    // Fungsi untuk mengekstrak data dari Firebase dan mengunduhnya sebagai CSV/Excel
    const extractData = async () => {
        const dataRef = ref(database, 'Presensi-Inspi');
    
        try {
            const snapshot = await get(dataRef);
    
            if (snapshot.exists()) {
                const data = snapshot.val();
                const extractedData = [];
    
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    extractedData.push({
                        WAKTU: formatTimestamp(item.timestamp),
                        NAMA: item.name,
                        NIM: item.nim,
                        PRODI: item.prodi,
                        JABATAN: item.Jabatan,
                        KETERANGAN: item.keterangan
                    });
                });
    
                const worksheet = XLSX.utils.json_to_sheet(extractedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Presensi-Inspi");
    
                XLSX.writeFile(workbook, "PRESENSI-INSPI.xlsx");
                Swal.fire({
                    title: "Export Excel Success",
                    icon: "success"
                  });
            } else {
                Swal.fire({
                    title: "Data Kosong !",
                    icon: "warning"
                  });
            }
        } catch (error) {
            console.error("Error extracting data from database", error);
            alert("Terjadi kesalahan saat mengekstrak data.");
        }
    };
    // Fungsi untuk melakukan migrasi data
    const migrateData = async () => {
        // Tampilkan form menggunakan SweetAlert
        const { value: formValues } = await Swal.fire({
            title: 'Migrate Data',
            html:
                '<div class="max-w-sm mx-auto">' +
                '<div class="mb-5"><input id="swal-input1" class="swal2-input bg-white border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Judul Data"></div>' +
                '<div class="mb-5"><input id="swal-input2" type="date" class="swal2-input bg-white border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tanggal"></div>' +
                '<div class="mb-5"><select id="swal-input3" class="swal2-input bg-white border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">' +
                '<option value="">Pilih Database</option>' +
                '<option value="Presensi-Inspi">Presensi Hadir</option>' +
                '<option value="Inspi-Telat">Presensi Terlambat</option>' +
                '</select></div>' +
                '</div>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            customClass: {
                confirmButton: 'swall-custom',
                cancelButton: 'swall-cancel'
            },
            preConfirm: () => {
                const judul = document.getElementById('swal-input1').value;
                const tanggal = document.getElementById('swal-input2').value;
                const databaseName = document.getElementById('swal-input3').value;
                if (!judul || !tanggal || !databaseName) {
                    Swal.showValidationMessage('Mohon isi semua field');
                    return false;
                }
                return { judul, tanggal, databaseName };
            }
        });
    
        // Jika pengguna mengklik tombol batal, keluar dari fungsi
        if (!formValues) {
            return;
        }
    
        const { judul, tanggal, databaseName } = formValues;
    
        // Ambil data dari database yang dipilih
        const dataRef = ref(database, databaseName);
    
        try {
            const snapshot = await get(dataRef);
    
            if (snapshot.exists()) {
                const data = snapshot.val();
    
                // Buat objek JSON yang akan disimpan
                const migrateObject = {
                    judul: judul,
                    tanggal: tanggal,
                    databaseName: databaseName,
                    data: data
                };
    
                // Buat referensi baru di '/migrate-data' dengan push key
                const migrateRef = push(ref(database, 'migrate-data'));
    
                // Simpan data ke Firebase
                await set(migrateRef, migrateObject);
    
                Swal.fire({
                    icon: 'success',
                    title: 'Migrasi Data Berhasil',
                    text: `Data dari ${databaseName} telah dimigrasikan dengan judul "${judul}" dan tanggal "${tanggal}".`,
                    customClass: {
                        confirmButton: 'swall-custom',
                    }
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Data Kosong',
                    text: 'Tidak ada data yang tersedia untuk dimigrasikan dari database yang dipilih.'
                });
            }
        } catch (error) {
            console.error("Error migrating data: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Terjadi kesalahan saat melakukan migrasi data.'
            });
        }
    };
    
    // Tambahkan event listener untuk tombol "Migrate Data"
    document.getElementById("migrate-data").addEventListener("click", migrateData);
    // Event listener untuk tombol "Remove All Data"
    document.getElementById("remove-all").addEventListener("click", removeAllData);
    
    // Event listener untuk tombol "Extract Data"
    document.getElementById("print-data").addEventListener("click", extractData);
    
    // Panggil fungsi fetchData ketika halaman dimuat
    fetchData();
    
    // Menambahkan event listener untuk perubahan data secara real-time
    const dataRef = ref(database, 'Presensi-Inspi');
    onValue(dataRef, (snapshot) => {
        fetchData();
    });
};

