const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authentication");
const {
  allComments,
  createComment,
  deleteComment,
  likeToggler,
} = require("../../controllers/comments");

//? All Comments for Article
router.get("/:slug/comments", verifyToken, allComments);
//* Create Comment for Article
router.post("/:slug/comments", verifyToken, createComment);
//* Delete Comment for Article
router.delete("/:slug/comments/:commentId", verifyToken, deleteComment);
//* Like Comment
router.post("/:slug/comments/:commentId/like", verifyToken, likeToggler);
//* Unlike Comment
router.delete("/:slug/comments/:commentId/like", verifyToken, likeToggler);

module.exports = router;
