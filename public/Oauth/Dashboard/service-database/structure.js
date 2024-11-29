import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    onValue, 
    remove, 
    update,
    serverTimestamp,
    get
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

let firebaseApp;
let database;
let auth;

async function fetchFirebaseConfig() {
    try {
        const response = await fetch('/firebase-config');
        const config = await response.json();
        
        if (!config) {
            throw new Error('Konfigurasi Firebase tidak valid');
        }
        
        firebaseApp = initializeApp(config);
        database = getDatabase(firebaseApp);
        auth = getAuth(firebaseApp);
        
        return database;
    } catch (error) {
        console.error('Kesalahan mengambil konfigurasi Firebase:', error);
        throw error;
    }
}


// Konversi gambar ke Base64
async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Tambah Anggota
async function tambahAnggota(nama, thumbnail, jabatan, link) {
    try {
        Swal.fire({
            title: 'Memproses...',
            html: 'Sedang mengunggah data',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Pastikan Firebase sudah diinisialisasi
        await fetchFirebaseConfig();
        const database = getDatabase();
        const membersRef = ref(database, 'structure-member');
        const newMemberRef = push(membersRef);

        await set(newMemberRef, {
            nama: nama,
            thumbnail: thumbnail,
            jabatan: jabatan,
            link: link,
            timestamp: serverTimestamp()
        });

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Anggota baru telah ditambahkan'
        });

        // Refresh tabel setelah menambahkan anggota
        tampilkanAnggota();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Kesalahan',
            text: 'Gagal menambahkan anggota'
        });
        console.error('Kesalahan:', error);
    }
}

// Tampilkan Anggota dalam Tabel
async function tampilkanAnggota() {
    try {
        // Pastikan Firebase sudah diinisialisasi
        await fetchFirebaseConfig();
        const database = getDatabase();
        const membersRef = ref(database, 'structure-member');

        onValue(membersRef, (snapshot) => {
            const tableBody = document.getElementById('table-member');
            tableBody.innerHTML = '';

            snapshot.forEach((childSnapshot) => {
                const member = childSnapshot.val();
                const memberId = childSnapshot.key;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-3 px-6 text-center">${new Date(member.timestamp).toLocaleString()}</td>
                    <td class="py-3 px-6 text-center">${member.nama}</td>
                    <td class="py-3 px-6 text-center">${member.jabatan}</td>
                     <td class="py-3 px-6 text-center">
                        <img src="${member.thumbnail}" class="w-16 h-16 object-cover mx-auto" />
                    </td>
                    <td class="py-3 px-6 text-center">${member.link}</td>
                    <td class="py-3 px-6 flex space-x-2">
                        <button onclick="window.detailAnggota('${memberId}')" class="bg-blue-500 text-white px-3 py-1 rounded">Detail</button>
                        <button onclick="window.editAnggota('${memberId}')" class="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                        <button onclick="window.hapusAnggota('${memberId}')" class="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
    } catch (error) {
        console.error('Kesalahan menampilkan anggota:', error);
    }
}

// Detail Anggota
async function detailAnggota(memberId) {
    try {
        await fetchFirebaseConfig();
        const database = getDatabase();
        const memberRef = ref(database, `structure-member/${memberId}`);

        const snapshot = await get(memberRef);
        if (snapshot.exists()) {
            const member = snapshot.val();
            Swal.fire({
                title: 'Detail Anggota',
                html: `
                <img src="${member.thumbnail}" class="mx-auto mt-4" style="max-width: 300px;" />
                    <p><strong>Nama:</strong> ${member.nama}</p>
                    <p><strong>Jabatan:</strong> ${member.jabatan}</p>
                    <p><strong>Link:</strong> ${member.link}</p>
                `,
                showCloseButton: true
            });
        }
    } catch (error) {
        console.error('Kesalahan mendapatkan detail anggota:', error);
    }
}

// Edit Anggota
async function editAnggota(memberId) {
    try {
        await fetchFirebaseConfig();
        const database = getDatabase();
        const memberRef = ref(database, `structure-member/${memberId}`);

        const snapshot = await get(memberRef);
        if (snapshot.exists()) {
            const member = snapshot.val();
            Swal.fire({
                title: 'Edit Anggota',
                html: `
                    <input id="swal-input-nama" class="swal2-input" placeholder="Nama" value="${member.nama}">
                    <input id="swal-input-jabatan" class="swal2-input" placeholder="Jabatan" value="${member.jabatan}">
                    <input id="swal-input-link" class="swal2-input" placeholder="Link" value="${member.link}">
                    <input type="file" id="swal-input-thumbnail" class="swal2-input" accept="image/*">
                `,
                focusConfirm: false,
                preConfirm: async () => {
                    const nama = document.getElementById('swal-input-nama').value;
                    const jabatan = document.getElementById('swal-input-jabatan').value;
                    const link = document.getElementById('swal-input-link').value;
                    const thumbnailFile = document.getElementById('swal-input-thumbnail').files[0];

                    let thumbnailBase64 = member.thumbnail;
                    if (thumbnailFile) {
                        thumbnailBase64 = await convertImageToBase64(thumbnailFile);
                    }

                    await update(memberRef, {
                        nama, 
                        jabatan, 
                        link, 
                        thumbnail: thumbnailBase64
                    });

                    Swal.fire('Berhasil', 'Data anggota telah diperbarui', 'success');
                    tampilkanAnggota();
                }
            });
        }
    } catch (error) {
        console.error('Kesalahan mengedit anggota:', error);
    }
}

// Hapus Anggota
async function hapusAnggota(memberId) {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data anggota akan dihapus permanen',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetchFirebaseConfig();
                const database = getDatabase();
                const memberRef = ref(database, `structure-member/${memberId}`);
                
                await remove(memberRef);
                Swal.fire('Terhapus!', 'Data anggota telah dihapus.', 'success');
                tampilkanAnggota();
            } catch (error) {
                Swal.fire('Kesalahan', 'Gagal menghapus data', 'error');
                console.error('Kesalahan menghapus anggota:', error);
            }
        }
    });
}

// Event Listener untuk Tombol Tambah Anggota
document.getElementById('add-member').addEventListener('click', () => {
    Swal.fire({
        title: 'Tambah Anggota Baru',
        html: `
            <input id="swal-input-nama" class="swal2-input" placeholder="Nama">
            <input id="swal-input-jabatan" class="swal2-input" placeholder="Jabatan">
            <input id="swal-input-link" class="swal2-input" placeholder="Link">
            <input type="file" id="swal-input-thumbnail" class="swal2-input" accept="image/*">
        `,
        focusConfirm: false,
        preConfirm: async () => {
            const nama = document.getElementById('swal-input-nama').value;
            const jabatan = document.getElementById('swal-input-jabatan').value;
            const link = document.getElementById('swal-input-link').value;
            const thumbnailFile = document.getElementById('swal-input-thumbnail').files[0];

            if (!nama || !jabatan || !thumbnailFile || !link) {
                Swal.showValidationMessage('Silakan lengkapi semua field');
                return false;
            }

            const thumbnailBase64 = await convertImageToBase64(thumbnailFile);
            await tambahAnggota(nama, thumbnailBase64, jabatan, link);
        }
    });
});

// Ekspos fungsi ke window global
window.detailAnggota = detailAnggota;
window.editAnggota = editAnggota;
window.hapusAnggota = hapusAnggota;

// Panggil fungsi tampilkan anggota saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchFirebaseConfig();
        tampilkanAnggota();
    } catch (error) {
        console.error('Kesalahan inisialisasi:', error);
    }
});