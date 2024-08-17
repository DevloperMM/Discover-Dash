mapboxgl.accessToken = mapToken;

const listing = JSON.parse(listingStr);

let currCoords = listing.geometry.coordinates;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: currCoords,
  zoom: 8,
});

const marker = new mapboxgl.Marker({ color: "red", scale: "0.7" })
  .setLngLat(currCoords)
  .addTo(map);

let popHTML = `<p class="pop-content">${listing.location}, ${listing.country}</p>`;
const popup = new mapboxgl.Popup({
  offset: 25,
  className: "my-class",
  closeOnClick: false,
  closeButton: false,
})
  .setLngLat(currCoords)
  .setHTML(popHTML)
  .addTo(map);

marker.getElement().addEventListener("click", () => {
  if (popup.isOpen()) {
    popup.remove();
  } else {
    popup.addTo(map);
  }
});
