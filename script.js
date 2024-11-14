// Initialize the map centered on Chesterfield, UK
var map = L.map('map').setView([53.2406, -1.4484], 13); // Chesterfield's latitude and longitude

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marker data (you can modify this or load dynamically)
var markersData = [
    {
        lat: 53.2406,
        lon: -1.4484,
        name: "Marker 1",
        description: "Information for Marker 1"
    },
    {
        lat: 53.2430,
        lon: -1.4410,
        name: "Marker 2",
        description: "Information for Marker 2"
    }
];

// To store references for the markers and divs
var markers = [];
var divs = [];
var addedMarkers = {}; // To track if a marker's data has already been added to the table

// Create the markers on the map and corresponding divs for dragging
markersData.forEach(function(data, index) {
    var marker = L.marker([data.lat, data.lon]).addTo(map).bindPopup(data.name + "<br>" + data.description);

    // Dynamically create a div for the marker
    var div = document.createElement("div");
    div.classList.add("marker-div");
    div.id = "marker-div-" + index;
    div.setAttribute("draggable", "true");
    div.innerHTML = data.name; // You can customize the content of the div as needed

    // Store the marker and div in the arrays
    markers.push(marker);
    divs.push(div);

    // When the div is dragged, show the information
    div.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData("text", div.id); // Set the div's id for later retrieval
    });

    // Append the div to the DOM (for example, in the bottom panel)
    document.getElementById("table-panel").appendChild(div);
});

// Create a table for the bottom panel where we drop the marker data
var table = document.createElement("table");
table.classList.add("table");
document.getElementById("table-panel").appendChild(table);

// Allow the table to accept the drop action
document.getElementById("table-panel").addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

// Handle the drop event
document.getElementById("table-panel").addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var data = e.dataTransfer.getData("text");
    var div = document.getElementById(data);

    // Get the index of the dragged marker from its div id
    var index = parseInt(div.id.split("-")[2]);

    // Check if the data for this marker has already been added to the table
    if (!addedMarkers[index]) {
        // If not added before, append the data to the table
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = markersData[index].name;
        cell2.innerHTML = markersData[index].description;

        // Mark this marker as added
        addedMarkers[index] = true;
    }
});
