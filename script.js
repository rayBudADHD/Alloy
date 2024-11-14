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
            var point = map.latLngToContainerPoint([location.lat, location.lon]);

            // Check if the marker is within the map's visible bounds
            var bounds = map.getBounds(); // Get the map's current visible area
            var isInBounds = bounds.contains([location.lat, location.lon]);

            // If the marker is within bounds, position the div and make it visible
            if (isInBounds) {
                dragElement.style.left = `${point.x - dragElement.offsetWidth / 2}px`;
                dragElement.style.top = `${point.y - dragElement.offsetHeight / 2}px`;
                dragElement.style.display = 'block'; // Show the div
            } else {
                dragElement.style.display = 'none'; // Hide the div if it's out of bounds
            }
        }

        // Call the function initially and whenever the map is moved
        updateDivPosition();
        map.on('move', updateDivPosition); // Update position on map move

        // Handle dragstart event
        dragElement.addEventListener('dragstart', function (event) {
            // Prevent map from moving when dragging the div
            map.dragging.disable();

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
            var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow();
            newRow.setAttribute('data-id', id); // Add custom data attribute for row identification
            newRow.insertCell(0).textContent = name;
            newRow.insertCell(1).textContent = description;

            // Add the cross button to the row
            var crossCell = newRow.insertCell(2);
            var crossButton = document.createElement('button');
            crossButton.textContent = '❌';  // The cross icon
            crossButton.classList.add('remove-record');  // Optional class for styling
            crossCell.appendChild(crossButton);

            // Add click event to the cross button
            crossButton.addEventListener('click', function () {
                // Retrieve the row and marker ID from the clicked cross
                var row = this.closest('tr'); // Find the closest row to the clicked button
                var markerId = row.getAttribute('data-id'); // Get the marker ID from the row's data-id attribute

                // Retrieve the marker and div using the ID
                var markerData = markers[markerId];
                if (markerData) {
                    // Make the marker visible again
                    markerData.marker.setOpacity(1);  // Show marker

                    // Move the draggable div back to the marker's position
                    var point = map.latLngToContainerPoint([markerData.data.lat, markerData.data.lon]);
                    markerData.div.style.left = `${point.x - markerData.div.offsetWidth / 2}px`;
                    markerData.div.style.top = `${point.y - markerData.div.offsetHeight / 2}px`;
                    markerData.div.style.display = 'block';  // Show the draggable div again
                }

                // Remove the table row (the record)
                row.remove();

                // Mark the marker as available again for dragging
                markers[markerId].dropped = false; // Reset the dropped flag
            });

            // Mark the marker as "dropped" to prevent it from being added multiple times
            markers[id].dropped = true;

            // Retrieve the marker using the ID
            var markerData = markers[id];
            if (markerData) {
                // Make the marker invisible (or remove it from the map)
                markerData.marker.setOpacity(0);  // Hide marker
                markerData.div.style.display = 'none';  // Hide the draggable div
            }
        });
    });
});
