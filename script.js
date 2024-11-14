// scripts.js

// Initialize the map and set its view to Chesterfield, UK (latitude: 53.2406, longitude: -1.4484)
var map = L.map('map').setView([53.2406, -1.4484], 13); // Chesterfield's latitude and longitude

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker at Chesterfield
var marker = L.marker([53.2406, -1.4484]).addTo(map);

// Add a popup to the marker that will display when it's clicked
marker.bindPopup("<b>Chesterfield, UK</b><br>This is the town center.").openPopup();
