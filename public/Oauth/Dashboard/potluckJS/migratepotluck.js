import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
    const dbRef = ref(database, 'migrate-potluck');

    // Fixed: Path reference in deleteData function
    function deleteData(key) {
        // Changed from 'migrate-data' to 'migrate-potluck'
        const itemRef = ref(database, `migrate-potluck/${key}`);
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

                // Add event listeners after appending the card
                document.getElementById(`downloadBtn-${key}`).addEventListener('click', function(e) {
                    e.preventDefault();
                    downloadExcel(item);
                });

                document.getElementById(`deleteBtn-${key}`).addEventListener('click', function(e) {
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
            const cardContainer = document.getElementById('card-data');
            cardContainer.innerHTML = '<p class="text-center">No data available</p>';
        }
    }, (error) => {
        console.error("Error fetching data:", error);
    });
};