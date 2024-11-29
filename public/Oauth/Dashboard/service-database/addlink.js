import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    onValue, 
    remove, 
    update
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

class LinkDriveManager {
    constructor() {
        this.firebaseApp = null;
        this.database = null;
        this.auth = null;
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
            this.auth = getAuth(this.firebaseApp);
            
            this.setupEventListeners();
            this.fetchLinkDrive();
        } catch (error) {
            console.error('Kesalahan inisialisasi Firebase:', error);
            this.showErrorToast('Gagal menginisialisasi aplikasi');
        }
    }

    // Pengaturan event listener
    setupEventListeners() {
        const addButton = document.getElementById('add-linkdrive');
        if (addButton) {
            addButton.addEventListener('click', () => this.showAddLinkForm());
        }
    }

    // Tampilkan form tambah link
    async showAddLinkForm() {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Link Drive',
            html:
                '<input id="swal-nama" class="swal2-input" placeholder="Nama Link" required>' +
                '<input id="swal-link" class="swal2-input" placeholder="Link Drive" required>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const nama = document.getElementById('swal-nama').value.trim();
                const link = document.getElementById('swal-link').value.trim();
                
                if (!nama || !link) {
                    Swal.showValidationMessage('Mohon isi semua field');
                    return false;
                }
                return { nama, link };
            }
        });

        if (formValues) {
            await this.saveLinkDrive(formValues);
        }
    }

    // Simpan link drive baru
    async saveLinkDrive(data) {
        try {
            this.showLoadingToast('Menyimpan Data...');

            const linkRef = ref(this.database, 'linkdrive');
            const newLinkRef = push(linkRef);
            
            await set(newLinkRef, {
                nama: data.nama,
                link: data.link,
                timestamp: new Date().toISOString()
            });

            this.showSuccessToast('Data berhasil disimpan!');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showErrorToast('Gagal menyimpan data');
        }
    }

    // Ambil dan tampilkan data link drive
    fetchLinkDrive() {
        const linkRef = ref(this.database, 'linkdrive');
        onValue(linkRef, (snapshot) => {
            const tableBody = document.getElementById('table-linkdrive');
            if (!tableBody) return;

            tableBody.innerHTML = '';

            snapshot.forEach((childSnapshot) => {
                const id = childSnapshot.key;
                const data = childSnapshot.val();
                const row = this.createTableRow(id, data);
                tableBody.appendChild(row);
            });
        });
    }

    // Buat baris tabel
    createTableRow(id, data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-4 px-6 text-center">${new Date(data.timestamp).toLocaleString()}</td>
            <td class="py-4 px-6 text-center">${data.nama}</td>
            <td class="py-4 px-6 text-center">
                <a href="${data.link}" target="_blank" class="text-blue-600 hover:text-blue-800 truncate">${data.link}</a>
            </td>
            <td class="py-4 px-6 flex justify-center gap-2">
                <button onclick="linkDriveManager.editLink('${id}', '${data.nama}', '${data.link}')" 
                        class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                    Edit
                </button>
                <button onclick="linkDriveManager.deleteLink('${id}')"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Hapus
                </button>
            </td>
        `;
        return row;
    }

    // Edit link drive
    async editLink(id, nama, link) {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Link Drive',
            html:
                `<input id="swal-nama" class="swal2-input" placeholder="Nama Link" value="${nama}" required>` +
                `<input id="swal-link" class="swal2-input" placeholder="Link Drive" value="${link}" required>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newNama = document.getElementById('swal-nama').value.trim();
                const newLink = document.getElementById('swal-link').value.trim();
                
                if (!newNama || !newLink) {
                    Swal.showValidationMessage('Mohon isi semua field');
                    return false;
                }
                return { nama: newNama, link: newLink };
            }
        });

        if (formValues) {
            try {
                this.showLoadingToast('Mengupdate Data...');

                const linkRef = ref(this.database, `linkdrive/${id}`);
                await update(linkRef, {
                    nama: formValues.nama,
                    link: formValues.link,
                    timestamp: new Date().toISOString()
                });

                this.showSuccessToast('Data berhasil diupdate!');
            } catch (error) {
                console.error('Error updating data:', error);
                this.showErrorToast('Gagal mengupdate data');
            }
        }
    }

    // Hapus link drive
    async deleteLink(id) {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                this.showLoadingToast('Menghapus Data...');

                const linkRef = ref(this.database, `linkdrive/${id}`);
                await remove(linkRef);

                this.showSuccessToast('Data berhasil dihapus!');
            } catch (error) {
                console.error('Error deleting data:', error);
                this.showErrorToast('Gagal menghapus data');
            }
        }
    }

    // Tampilan toast untuk loading
    showLoadingToast(message) {
        Swal.fire({
            title: message,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    // Tampilan toast untuk sukses
    showSuccessToast(message) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: message
        });
    }

    // Tampilan toast untuk error
    showErrorToast(message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
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