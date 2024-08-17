const Listing = require("../models/listing");
const { fetchCoordinates } = require("../utils/coordinates");

module.exports.listingsIndex = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you requested doesn't exist");
    return res.redirect("/listings");
  }

  listing.description = listing.description.trim();
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let coordinates = await fetchCoordinates(req);

  //it is the listing details from form to save in DB
  let newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = coordinates;

  await newListing.save();

  req.flash("success", "Listed Successfully !!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "The listing you requested doesn't exist");
    res.redirect("/listings");
    return;
  }

  let originalUrl = listing.image.url;
  let isOnCloud = true;
  if (!originalUrl.includes("cloudinary")) {
    isOnCloud = false;
  } else {
    originalUrl = originalUrl.replace("/upload", "/upload/h_200,w_300");
  }

  res.render("listings/edit.ejs", { listing, originalUrl, isOnCloud });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
  }

  if (listing.location !== req.body.listing.location) {
    let coordinates = await fetchCoordinates(req);
    listing.geometry = coordinates;
  }

  await listing.save();

  req.flash("success", "Edited Successfully !!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let delListing = await Listing.findByIdAndDelete(id);

  req.flash("success", "Deleted Successfully !!");
  console.log(delListing);
  res.redirect("/listings");
};
