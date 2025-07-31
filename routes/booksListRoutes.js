const router = require("express").Router();
const UserBookList = require("../models/UserBookList");
const { requireLogin } = require("../middleware/authMiddleware");

router.post("/", requireLogin, async (req, res) => {
  const { bookId, status } = req.body;
  const userId = req.session.user._id;

  if (status === "remove") {
    await UserBookList.findOneAndDelete({ userId, bookId });
  } else {
    await UserBookList.findOneAndUpdate(
      { userId, bookId },
      { status },
      { upsert: true, new: true }
    );
  }

  res.redirect("/books/" + bookId);
});

module.exports = router

