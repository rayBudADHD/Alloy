document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map at a general location
    var map = L.map('map', { dragging: true }).setView([53.2406, -1.4484], 13); // Chesterfield's coordinates

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Example of dynamic data for markers
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
        // Create Leaflet markers (but they will not be dragged in this case)
        var marker = L.marker([location.lat, location.lon]).addTo(map);

        // Bind a popup with the information from the location object
        marker.bindPopup(`
            <b>${location.name}</b><br>
            ${location.description}
        `);

        // Create a custom draggable div to represent the marker
        var dragElement = document.createElement('div');
        dragElement.textContent = location.name;
        dragElement.classList.add('drag-marker');  // Add CSS class for styling
        dragElement.draggable = true;  // Make it draggable

        // Set custom data to be transferred when dragging starts
        dragElement.addEventListener('dragstart', function (event) {
            // Disable map dragging during drag operation
            map.dragging.disable();

            // Set data for drag (marker details)
            event.dataTransfer.setData('name', location.name);
            event.dataTransfer.setData('description', location.description);
            event.dataTransfer.setData('lat', location.lat.toString()); // Ensure lat is a string
            event.dataTransfer.setData('lon', location.lon.toString()); // Ensure lon is a string
        });

        // Re-enable map dragging when the drag operation ends
        dragElement.addEventListener('dragend', function () {
            map.dragging.enable();
        });

        // Append the draggable div to the body (or any specific container for the markers)
        document.body.appendChild(dragElement);

        // Handle the dragging logic (drag over and drop) in the bottom panel
        document.getElementById('bottom-panel').addEventListener('dragover', function (event) {
            event.preventDefault();  // Allow drop
            event.dataTransfer.dropEffect = "move";  // Show move cursor on drop target
        });

        // Handle the drop event
        document.getElementById('bottom-panel').addEventListener('drop', function (event) {
            event.preventDefault();

            // Retrieve the data from the drag event
            var name = event.dataTransfer.getData('name');
            var description = event.dataTransfer.getData('description');
            var lat = parseFloat(event.dataTransfer.getData('lat'));  // Convert lat to float
            var lon = parseFloat(event.dataTransfer.getData('lon'));  // Convert lon to float

            // Check if lat and lon are valid numbers
            if (isNaN(lat) || isNaN(lon)) {
                console.error('Error: Invalid Latitude or Longitude');
                return;
            }

            // Insert the dragged data into the table (add to bottom panel's table)
            var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow(table.rows.length);
            newRow.insertCell(0).textContent = name;
            newRow.insertCell(1).textContent = description;

            // Optional: Make the custom marker invisible on the map (if needed)
            marker.setOpacity(0);  // This will make the Leaflet marker invisible (you can remove this if unnecessary)
        });
    });
});
