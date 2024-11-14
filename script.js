document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map at a general location
    var map = L.map('map', { dragEnable: true }).setView([53.2406, -1.4484], 13); // Chesterfield's coordinates

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

    // Loop through the locations and create draggable markers
    locations.forEach(function (location) {
        var marker = L.marker([location.lat, location.lon], { draggable: true }).addTo(map);

        // Bind a dynamic popup with the information from the location object
        marker.bindPopup(`
            <b>${location.name}</b><br>
            ${location.description}
        `);

        // Disable map dragging when the marker is being dragged
        marker.on('dragstart', function () {
            map.dragging.disable();  // Disable map drag
        });

        // Re-enable map dragging after the drag ends
        marker.on('dragend', function () {
            map.dragging.enable();  // Re-enable map drag
        });

        // When the drag starts, we set the drag data
        marker.on('dragstart', function (event) {
            event.target._icon.setAttribute("draggable", "true"); // Make the marker draggable

            // Store data in the drag event (this will be passed to the drop target)
            event.target._icon.setAttribute("data-name", location.name);
            event.target._icon.setAttribute("data-description", location.description);
        });

        // Set up event for when marker is dragged and dropped onto the table
        document.getElementById('bottom-panel').addEventListener('dragover', function (event) {
            event.preventDefault(); // Allow drop
        });

        document.getElementById('bottom-panel').addEventListener('drop', function (event) {
            event.preventDefault();

            // Get the dragged data from the marker's attributes
            var name = event.target.querySelector('[data-name]').getAttribute("data-name");
            var description = event.target.querySelector('[data-description]').getAttribute("data-description");

            // Insert the dragged data into the table
            var table = document.getElementById('marker-table').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow(table.rows.length);
            newRow.insertCell(0).textContent = name;
            newRow.insertCell(1).textContent = description;

            // Optionally, you can also remove the data after drop
            event.target._icon.removeAttribute("draggable");
        });
    });
});
