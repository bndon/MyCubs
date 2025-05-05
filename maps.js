// Google Maps initialization
function initMap() {
  // Coordinates for Jakarta (replace with exact daycare location)
  const daycareLocation = { lat: -6.2088, lng: 106.8456 };
  
  // Create map centered on the daycare
  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 15,
    center: daycareLocation,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    styles: [
      {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [{ "visibility": "on" }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#e8f7dc" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#c3d7ec" }]
      }
    ]
  });
  
  // Add marker for the daycare
  const marker = new google.maps.Marker({
    position: daycareLocation,
    map: map,
    title: "Flexible Baby Daycare Jakarta",
    animation: google.maps.Animation.DROP
  });
  
  // Add info window
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 10px; font-weight: bold;">Flexible Baby Daycare</h3>
        <p style="margin: 0;">Jl. Kemang Raya No. 123<br>Jakarta Selatan, 12730</p>
      </div>
    `
  });
  
  // Open info window when marker is clicked
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
  
  // Open info window by default
  infoWindow.open(map, marker);
}