document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map at a general location
    var map = L.map('map').setView([53.2406, -1.4484], 13); // Chesterfield's coordinates

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Example of dynamic data
    var locations = [
        {
            id: 1,
            name: "Chesterfield Town Centre",
            lat: 53.2406,
            lon: -1.4484,
            description: "The heart of Chesterfield. Famous for its crooked spire."
        },
        {
            id: 2,
            name: "Chesterfield Railway Station",
            lat: 53.2366,
            lon: -1.4420,
            description: "Chesterfield's main railway station with routes to London and beyond."
        }
    ];

    // Loop through the locations and create markers
    locations.forEach(function (location) {
        var marker = L.marker([location.lat, location.lon], {
            draggable: false // Disable default Leaflet drag
        }).addTo(map);

        // Bind a popup with the information from the location object
        marker.bindPopup(`
            <b>${location.name}</b><br>
            ${location.description}
        `);

        var dragElement = document.createElement('div');
        dragElement.textContent = location.name;
        dragElement.classList.add('drag-marker');  // Class for styling
        dragElement.draggable = true;  // Make it draggable

        // Add a custom icon (this will be used for dragging)
        var dragElement = document.createElement('div');
        dragElement.textContent = location.name;
        dragElement.classList.add('drag-marker');  // Class for styling
        dragElement.draggable = true;  // Make it draggable

        // When the drag starts, set the drag data
        dragElement.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('name', location.name);
            event.dataTransfer.setData('description', location.description);
            event.dataTransfer.setData('lat', location.lat);
            event.dataTransfer.setData('lon', location.lon);
        });

        // When the drag ends, append the marker data to the table
        dragElement.addEventListener('dragend', function (event) {
            var name = event.dataTransfer.getData('name');
            var description = event.dataTransfer.getData('description');

            // Insert the dragged data into the table
            var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow(table.rows.length);
            newRow.insertCell(0).textContent = name;
            newRow.insertCell(1).textContent = description;

            // Optionally, you can remove the data after drop
        });

        // Add the custom draggable element to the map
        document.body.appendChild(dragElement);
    });

    // Set up event for the table to accept the drop
    document.getElementById('bottom-panel').addEventListener('dragover', function (event) {
        event.preventDefault();  // Allow drop
    });

    // Handle the drop of the draggable marker's data into the table
    document.getElementById('bottom-panel').addEventListener('drop', function (event) {
        event.preventDefault();

        var name = event.dataTransfer.getData('name');
        var description = event.dataTransfer.getData('description');

        // Insert the dragged data into the table
        var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
        var newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).textContent = name;
        newRow.insertCell(1).textContent = description;
    });

    var newLatLon = new L.LatLng(lat, lon);
    marker.setLatLng(newLatLon);  // Move the marker to the dropped location

});
