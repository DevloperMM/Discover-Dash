const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.fetchCoordinates = async (req) => {
  let completeLocation = [
    req.body.listing.location,
    req.body.listing.country,
  ].join(", ");

  let response = await geocodingClient
    .forwardGeocode({
      query: completeLocation,
      limit: 1,
    })
    .send();

  return response.body.features[0].geometry;
};
