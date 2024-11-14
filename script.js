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

        // Add a custom draggable element to the DOM (which we will drag)
        var dragElement = document.createElement('div');
        dragElement.textContent = location.name;
        dragElement.classList.add('drag-marker');  // Class for styling
        dragElement.draggable = true;  // Make it draggable

        // When the drag starts, store the marker data (latitude, longitude, name, and description)
        dragElement.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('name', location.name);
            event.dataTransfer.setData('description', location.description);
            event.dataTransfer.setData('lat', location.lat.toString()); // Ensure lat is stored as a string
            event.dataTransfer.setData('lon', location.lon.toString()); // Ensure lon is stored as a string
        });

        // Add the custom draggable element to the DOM
        document.body.appendChild(dragElement);

        // Handle the dragging logic (drag over and drop)
        document.getElementById('bottom-panel').addEventListener('dragover', function (event) {
            event.preventDefault();  // Allow drop
        });

        // Handle the drop event
        document.getElementById('bottom-panel').addEventListener('drop', function (event) {
            event.preventDefault();

            // Retrieve the data from the drag event
            var name = event.dataTransfer.getData('name');
            var description = event.dataTransfer.getData('description');
            var lat = parseFloat(event.dataTransfer.getData('lat'));  // Convert lat to float
            var lon = parseFloat(event.dataTransfer.getData('lon'));  // Convert lon to float

            // Check if lat and lon are properly parsed as numbers
            if (isNaN(lat) || isNaN(lon)) {
                console.error('Error: Latitude or Longitude is not a valid number.');
                return;
            }

            // Insert the dragged data into the table
            var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow(table.rows.length);
            newRow.insertCell(0).textContent = name;
            newRow.insertCell(1).textContent = description;

            // Optionally, you could move the marker to a new position here on the map
            var newLatLon = new L.LatLng(lat, lon); // Create a new LatLng object
            marker.setLatLng(newLatLon);  // Move the marker to the dropped location on the map
        });
    });
});
