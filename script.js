// Initialize the map using Leaflet.js
const map = L.map('map').setView([51.505, -0.09], 13);  // Center the map at a given latitude and longitude

// Add tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map
L.marker([53.235, -1.42]).addTo(map)
    .bindPopup('A sample marker')
    .openPopup();

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', () => {
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';  // Hide sidebar
    } else {
        sidebar.style.left = '0px';  // Show sidebar
    }
});
