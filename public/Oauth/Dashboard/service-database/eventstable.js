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

// Inisialisasi Event Listener
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchFirebaseConfig();

        const createDataBtn = document.getElementById('create-data');
        createDataBtn.addEventListener('click', async () => {
            Swal.fire({
                title: 'Tambah Event Baru',
                html: `
                    <div class="space-y-4">
                        <div class="mb-5">
                            <label class="text-lg text-start text-xl text-black">Judul Event : </label>
                            <input id="swal-title" class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" placeholder="Judul Event">
                        </div>
                        <div class="mb-5">
                            <label class="text-lg text-start text-xl text-black">Upload Thumbnail : </label>
                            <input id="swal-thumbnail" type="file" class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" accept="image/*">
                        </div>
                        <div class="mb-5">
                            <label class="text-lg text-start text-xl text-black">Description : </label>
                            <div id="editor-container" class="mt-2 border border-gray-300 rounded-md bg-white p-4 shadow-sm"></div>
                        </div>
                        <div class="mb-5">
                            <label class="text-lg text-start text-xl text-black">Link Pendaftaran : </label>
                            <input id="swal-link" class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" placeholder="Link">
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Simpan',
                didOpen: async () => {
                    const editorElement = document.getElementById('editor-container');
                    ClassicEditor
                        .create(editorElement, {
                            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                        })
                        .then(editor => {
                            window.editor = editor;
                        })
                        .catch(error => {
                            console.error(error);
                        });
                },
                preConfirm: async () => {
                    const title = document.getElementById('swal-title').value;
                    const thumbnailFile = document.getElementById('swal-thumbnail').files[0];
                    const description = window.editor.getData();
                    const link = document.getElementById('swal-link').value;

                    if (!title || !thumbnailFile || !description || !link) {
                        Swal.showValidationMessage('Semua field harus diisi');
                        return;
                    }

                    const base64Thumbnail = await convertImageToBase64(thumbnailFile);

                    // Simpan data ke Firebase
                    const newEventRef = push(ref(database, 'events'));
                    await set(newEventRef, {
                        title,
                        thumbnail: base64Thumbnail,
                        description,
                        link,
                        timestamp: serverTimestamp()
                    });
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Berhasil!', 'Data event telah disimpan', 'success');
                    fetchAndRenderEvents(); // Refresh tabel
                }
            });
        });

        fetchAndRenderEvents(); // Load data awal
    } catch (error) {
        console.error('Kesalahan inisialisasi:', error);
        Swal.fire('Error!', 'Gagal menginisialisasi halaman: ' + error.message, 'error');
    }
});

// Helper Function: Konversi Gambar ke Base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Fungsi Fetch dan Render Events
function fetchAndRenderEvents() {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
        const eventsData = snapshot.val();
        const tableBody = document.getElementById('table-events');
        tableBody.innerHTML = ''; // Clear existing rows

        if (eventsData) {
            Object.entries(eventsData).forEach(([key, event]) => {
                const truncatedDesc = event.description.length > 30 
                    ? event.description.substring(0, 30) + '...' 
                    : event.description;

                const row = `
                    <tr>
                        <td class="py-3 px-6 text-center">${new Date(event.timestamp).toLocaleString()}</td>
                        <td class="py-3 px-6 text-center">${event.title}</td>
                        <td class="py-3 px-6 text-center">
                            <img src="${event.thumbnail}" alt="Thumbnail" class="w-20 h-20 object-cover mx-auto">
                        </td>
                        <td class="py-3 px-6 text-center">${truncatedDesc}</td>
                        <td class="py-3 px-6 text-center text-blue-500"><a href="${event.link}" target="_blank">${event.link}</a></td>
                        <td class="py-3 px-6 flex space-x-2">
                            <button onclick="showEventDetails('${key}')" class="bg-blue-500 text-white px-3 py-1 rounded">Detail</button>
                            <button onclick="editEvent('${key}')" class="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                            <button onclick="deleteEvent('${key}')" class="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
    });
}

// Fungsi Detail Event
window.showEventDetails = async (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    const snapshot = await get(eventRef);
    const event = snapshot.val();

    Swal.fire({
        title: event.title,
        html: `
            <img src="${event.thumbnail}" alt="Thumbnail" class="w-64 h-64 object-cover mx-auto mb-4">
            <div class="text-left">${event.description}</div>
            <a href="${event.link}" target="_blank" class="text-blue-500">Kunjungi Link</a>
        `,
        showCloseButton: true
    });
};

// Fungsi Edit Event
window.editEvent = async (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    const snapshot = await get(eventRef);
    const event = snapshot.val();
    
    Swal.fire({
        title: 'Edit Event',
        html: `
            <div class="space-y-4">
                <input id="swal-input-title" 
                       class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" 
                       placeholder="Judul" 
                       value="${event.title}">
                <div id="swal-input-description" class="mt-2 border border-gray-300 rounded-md bg-white p-4 shadow-sm"></div>
                <input id="swal-input-link" 
                       class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" 
                       placeholder="Link" 
                       value="${event.link}">
            </div>
        `,
        didOpen: () => {
            const descriptionElement = document.getElementById('swal-input-description');
            ClassicEditor
                .create(descriptionElement, {
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
                })
                .then(editor => {
                    editor.setData(event.description);
                    window.editor = editor;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        preConfirm: async () => {
            const updatedTitle = document.getElementById('swal-input-title').value;
            const updatedDescription = window.editor.getData();
            const updatedLink = document.getElementById('swal-input-link').value;

            await update(eventRef, {
                title: updatedTitle,
                description: updatedDescription,
                link: updatedLink
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Berhasil!', 'Event berhasil diperbarui.', 'success');
            fetchAndRenderEvents(); // Refresh tabel
        }
    });
};

// Fungsi Delete Event
window.deleteEvent = (eventId) => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Event ini akan dihapus secara permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            const eventRef = ref(database, `events/${eventId}`);
            remove(eventRef).then(() => {
                Swal.fire('Dihapus!', 'Event berhasil dihapus.', 'success');
                fetchAndRenderEvents(); // Refresh tabel
            });
        }
    });
};
