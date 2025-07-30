function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

function requireAuthor(req, res, next) {
  if (req.session.user && req.session.user.role === "author") {
    next();
  } else {
    res.send("Access denied. Authors only.");
  }
}

module.exports = { requireLogin, requireAuthor };
