const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);

    req.login(regUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust !!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

//   app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//       email: "student@gmail.com",
//       username: "webDev_learner",
//     });

//     let result = await User.register(fakeUser, "password");
//     res.send(result);
//   });

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust !!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "User must be logged in to Logout");
    return res.redirect("/listings");
  }
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out !!");
    res.redirect("/listings");
  });
};
