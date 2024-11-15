document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([53.2406, -1.4484], 13); // Chesterfield's coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Dynamic location data (array of markers)
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

    // Object to hold the mapping between markers and div elements
    var markers = {};

    locations.forEach(function (location) {
        // Create the Leaflet marker
        var marker = L.marker([location.lat, location.lon]).addTo(map);

        // Bind a popup to the marker
        marker.bindPopup(`
            <b>${location.name}</b><br>
            ${location.description}
        `);

        // Create the draggable div for the marker
        var dragElement = document.createElement('div');
        dragElement.textContent = location.name; // Name inside the div
        dragElement.classList.add('drag-marker'); // Add the class to the div
        dragElement.draggable = true; // Make it draggable

        // Store the marker and div association in the markers object
        markers[location.id] = {
            marker: marker,
            div: dragElement,
            data: location,
            dropped: false // Flag to track if the div has already been dropped
        };

        // Append the draggable div to the body (or any other container)
        document.body.appendChild(dragElement);

        // Update the div position whenever the map moves or the marker moves
        function updateDivPosition() {
            var bounds = map.getBounds(); // Get the map's current visible area
            var point = map.latLngToContainerPoint([location.lat, location.lon]);

            // Check if the marker is within the map's bounds
            var isInBounds = bounds.contains([location.lat, location.lon]);

            // If the marker is within bounds, position the div and make it visible
            if (isInBounds) {
                dragElement.style.left = `${point.x - dragElement.offsetWidth / 2}px`;
                dragElement.style.top = `${point.y - dragElement.offsetHeight / 2}px`;
                dragElement.style.display = 'block'; // Show the div
                markers[location.id].marker.setOpacity(1);  // Ensure marker is visible
            } else {
                dragElement.style.display = 'none'; // Hide the div if it's out of bounds
                markers[location.id].marker.setOpacity(0);  // Hide the marker if it's out of bounds
            }
        }

        // Call the function initially and whenever the map is moved
        updateDivPosition();
        map.on('move', updateDivPosition); // Update position on map move

        // Handle dragstart event
        dragElement.addEventListener('dragstart', function (event) {
            // Prevent map from moving when dragging the div
            map.dragging.disable();

            // Change the marker color to grey when dragging (for visual feedback)
            marker.getElement().classList.add('dragging');

            // Store the data to be transferred (marker data)
            event.dataTransfer.setData('name', location.name);
            event.dataTransfer.setData('description', location.description);
            event.dataTransfer.setData('lat', location.lat.toString());
            event.dataTransfer.setData('lon', location.lon.toString());
            event.dataTransfer.setData('id', location.id.toString()); // Store marker ID
        });

        // Handle dragend event
        dragElement.addEventListener('dragend', function () {
            // Re-enable map dragging after the drag operation ends
            map.dragging.enable();

            // After the drag ends, set the marker to be semi-transparent
            marker.getElement().classList.remove('dragging'); // Remove the "dragging" class
            markers[location.id].marker.setOpacity(0.5); // Make the marker semi-transparent
        });

        // Handle dragover event on the table (drop target)
        document.getElementById('bottom-panel').addEventListener('dragover', function (event) {
            event.preventDefault(); // Allow the drop
            event.dataTransfer.dropEffect = "move";  // Change cursor to indicate move
        });

        // Handle drop event on the table (accept the drop)
        document.getElementById('bottom-panel').addEventListener('drop', function (event) {
            event.preventDefault();

            var id = parseInt(event.dataTransfer.getData('id')); // Get the marker ID

            // Check if the marker has already been dropped (avoid multiple entries)
            if (markers[id].dropped) return; // Do nothing if already dropped

            // Retrieve the data from the drag event
            var name = event.dataTransfer.getData('name');
            var description = event.dataTransfer.getData('description');
            var lat = parseFloat(event.dataTransfer.getData('lat'));
            var lon = parseFloat(event.dataTransfer.getData('lon'));

            // Check for valid lat and lon values
            if (isNaN(lat) || isNaN(lon)) return;

            // Insert the data into the table
            var table = document.getElementById