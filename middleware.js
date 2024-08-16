const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressErr = require("./utils/ExpressErr");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //save redirect url
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "SignUp / Login to Create New Listing !!");
    res.redirect("/login");
    return;
  }
  //console.log(req.user);
  //it will have user if logged in else undefined
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.isUser._id)) {
    req.flash("error", "Access Denied !!");
    res.redirect(`/listings/${id}`);
    return;
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  //result is having key values in 'value' object
  if (error) {
    let errMsg = error.details.map((el) => el.message).join("; ");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let rate = req.body.review.rating;
  if (rate > 5 || rate < 1) {
    let { id } = req.params;
    req.flash("error", "Rating must be atleast 1 and atmost 5");
    res.redirect(`/listings/${id}`);
    return;
  }

  if (error) {
    let errMsg = error.details.map((el) => el.message).join("; ");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.isUser._id)) {
    req.flash("error", "Access Denied !!");
    res.redirect(`/listings/${id}`);
    return;
  }

  next();
};
