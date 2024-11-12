// Toggle Sidebar
document.getElementById('toggleSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('newSidebar').style.display = 'block';
});

document.getElementById('icon1').addEventListener('click', function() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('newSidebar').style.display = 'block';
});

document.getElementById('icon2').addEventListener('click', function() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('newSidebar').style.display = 'block';
});

// Leaflet Map
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

document.querySelectorAll('.draggable-item').forEach(function(item) {
    item.addEventListener('click', function() {
        var marker = L.marker([51.5, -0.09]).addTo(map)
            .bindPopup(this.innerText)
            .openPopup();
    });
});

// Drag and Drop
document.querySelectorAll('.draggable-item').forEach(function(item) {
    item.setAttribute('draggable', true);
    item.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text', event.target.innerText);
    });
});

document.querySelector('#tableSection tbody tr').addEventListener('dragover', function(event) {
    event.preventDefault();
});

document.querySelector('#tableSection tbody tr').addEventListener('drop', function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData('text');
    var cell = document.createElement('td');
    cell.innerText = data;
    event.target.appendChild(cell);
});

// Day Navigation
document.getElementById('prevDay').addEventListener('click', function() {
    // Implement previous day functionality
});

document.getElementById('nextDay').addEventListener('click', function() {
    // Implement next day functionality
});
