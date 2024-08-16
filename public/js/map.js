mapboxgl.accessToken = mapToken;

let currCoords = listing.geometry.coordinates;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: currCoords,
  zoom: 8,
});

new mapboxgl.Marker({ color: "red", scale: "0.7" })
  .setLngLat(currCoords)
  .addTo(map);

new mapboxgl.Popup({ offset: 15, className: "my-class", closeButton: false })
  .setLngLat(currCoords)
  .setHTML(`<h6>${listing.location}, ${listing.country}</h6>`)
  .addTo(map);
