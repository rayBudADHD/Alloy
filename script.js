// Initializing the map
var map = L.map('map').setView([53.2406, -1.4484], 13); // Chesterfield's latitude and longitude

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Data for locations (you can dynamically load this from an API or database)
var locations = [
    { id: 1, name: 'Marker 1', description: 'Description of Marker 1', lat: 53.2406, lon: -1.4484 },
    { id: 2, name: 'Marker 2', description: 'Description of Marker 2', lat: 53.2506, lon: -1.4384 },
    { id: 3, name: 'Marker 3', description: 'Description of Marker 3', lat: 53.2306, lon: -1.4584 }
];

// This object will track whether a marker has been dropped to avoid duplicates
let isDropped = {};

// Create and add markers, and associate them with draggable divs
locations.forEach(function(location) {
    // Create a marker on the map at the specified coordinates
    var marker = L.marker([location.lat, location.lon]).addTo(map);
    marker.bindPopup(location.name + "<br>" + location.description);

    // Create a draggable div element to represent the marker
    var dragElement = document.createElement('div');
    dragElement.textContent = location.name; // Use marker name in the div
    dragElement.classList.add('drag-marker'); // Add the drag-marker class
    dragElement.draggable = true; // Make it draggable

    // Store the marker and the corresponding div in the markers object
    markers[location.id] = {
        marker: marker,
        div: dragElement,
        data: location
    };

    // Append the div element to the body (or any other container)
    document.body.appendChild(dragElement);

    // Update the div position based on the marker's position on the map
    function updateDivPosition() {
        var point = map.latLngToContainerPoint([location.lat, location.lon]);
        dragElement.style.left = `${point.x - dragElement.offsetWidth / 2}px`;
        dragElement.style.top = `${point.y - dragElement.offsetHeight / 2}px`;
    }

    // Call the function initially and whenever the map is moved
    updateDivPosition();
    map.on('move', updateDivPosition); // Update position on map move

    // Make the div element draggable
    dragElement.addEventListener('dragstart', function (event) {
        console.log("Drag started", event);
        map.dragging.disable(); // Disable map dragging while dragging the div
        event.dataTransfer.setData('name', location.name);
        event.dataTransfer.setData('description', location.description);
        event.dataTransfer.setData('lat', location.lat.toString());
        event.dataTransfer.setData('lon', location.lon.toString());
        event.dataTransfer.setData('id', location.id.toString()); // Store marker ID
    });

    dragElement.addEventListener('dragend', function () {
        console.log("Drag ended");
        map.dragging.enable(); // Re-enable map dragging after the drag operation ends
    });
});

// Add event listener for dragging the div onto the table
const table = document.querySelector("#myTable");

table.addEventListener('dragover', function (event) {
    event.preventDefault(); // Allow dropping by preventing default behavior
    event.dataTransfer.dropEffect = 'move'; // Indicate a move operation
});

table.addEventListener('drop', function (event) {
    event.preventDefault();

    // Get the marker data from the dragged element
    const markerId = event.dataTransfer.getData('id');
    if (isDropped[markerId]) {
        console.log("This marker has already been dropped.");
        return; // Prevent adding the same marker again
    }

    // Mark this marker as dropped to avoid duplicate rows
    isDropped[markerId] = true;

    // Create the table row and insert the data
    const row = table.insertRow(); // Add a new row to the table
    row.innerHTML = `
        <td>${event.dataTransfer.getData('name')}</td>
        <td>${event.dataTransfer.getData('description')}</td>
        <td>${event.dataTransfer.getData('lat')}</td>
        <td>${event.dataTransfer.getData('lon')}</td>
    `;
    console.log("Row added:", row);
});
