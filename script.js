document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([53.2406, -1.4484], 13); // Chesterfield's coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Dynamic location data
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
        // Create the Leaflet marker (but not draggable)
        var marker = L.marker([location.lat, location.lon]).addTo(map);

        // Bind a popup to the marker
        marker.bindPopup(`
            <b>${location.name}</b><br>
            ${location.description}
        `);

        // Create a draggable div for custom drag functionality
        var dragElement = document.createElement('div');
        dragElement.textContent = location.name;
        dragElement.classList.add('drag-marker');
        dragElement.draggable = true;

        // Store the marker and div association in the markers object
        markers[location.id] = {
            marker: marker,
            div: dragElement,
            data: location
        };

        // Add the custom draggable element to the DOM
        document.body.appendChild(dragElement);

        // Handle dragstart event
        dragElement.addEventListener('dragstart', function (event) {
            // Prevent map from moving when dragging the div
            map.dragging.disable();

            // Set drag data
            event.dataTransfer.setData('name', location.name);
            event.dataTransfer.setData('description', location.description);
            event.dataTransfer.setData('lat', location.lat.toString());
            event.dataTransfer.setData('lon', location.lon.toString());
            event.dataTransfer.setData('id', location.id.toString()); // Store marker ID to match later
        });

        // Handle dragend event
        dragElement.addEventListener('dragend', function () {
            // Re-enable map dragging after drag ends
            map.dragging.enable();
        });

        // Handle dragover event on the table
        document.getElementById('bottom-panel').addEventListener('dragover', function (event) {
            event.preventDefault();  // Allow drop
            event.dataTransfer.dropEffect = "move";  // Change cursor to indicate move action
        });

        // Handle the drop event on the table
        document.getElementById('bottom-panel').addEventListener('drop', function (event) {
            event.preventDefault();

            // Retrieve the data from the drag event
            var name = event.dataTransfer.getData('name');
            var description = event.dataTransfer.getData('description');
            var lat = parseFloat(event.dataTransfer.getData('lat'));
            var lon = parseFloat(event.dataTransfer.getData('lon'));
            var id = parseInt(event.dataTransfer.getData('id'));  // Retrieve marker ID

            // Check if lat and lon are valid numbers
            if (isNaN(lat) || isNaN(lon)) return;

            // Insert data into the table
            var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow();
            newRow.insertCell(0).textContent = name;
            newRow.insertCell(1).textContent = description;

            // Make the marker invisible (or remove it from the map)
            var markerData = markers[id];
            if (markerData) {
                markerData.marker.setOpacity(0);  // This hides the marker on the map
            }

            // Optionally, hide the div (or you could remove it from the DOM)
            var draggedDiv = markers[id].div;
            draggedDiv.style.display = 'none';  // Hides the div from the page after it’s dropped
        });
    });
});
