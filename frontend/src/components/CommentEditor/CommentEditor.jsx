import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import postComment from "../../services/postComment";
import Avatar from "../Avatar";

function CommentEditor({ updateComments }) {
  const [{ body }, setForm] = useState({ body: "" });
  const [emptyCommentHint, setEmptyCommentHint] = useState(false);
  const { headers, isAuth, loggedUser } = useAuth();
  const { username, image } = loggedUser || {};
  const { slug } = useParams();
  const isCommentEmpty = body.trim().length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCommentEmpty) {
      setEmptyCommentHint(true);
      return;
    }

    postComment({ body, headers, slug })
      .then(updateComments)
      .then(() => setForm({ body: "" }))
      .catch(console.error);
  };

  const handleChange = (e) => {
    if (e.target.value.trim().length > 0) setEmptyCommentHint(false);
    setForm({ body: e.target.value });
  };

  return isAuth ? (
    <form className="card comment-form" onSubmit={handleSubmit}>
      <div className="card-block">
        <textarea
          className="form-control"
          onChange={handleChange}
          placeholder="Write a comment..."
          rows="3"
          value={body}
        ></textarea>
        {emptyCommentHint && (
          <small className="text-muted" role="status" aria-live="polite">
            请输入评论内容
          </small>
        )}
      </div>

      <div className="card-footer">
        <Avatar alt={username} className="comment-author-img" src={image} />
        <button className="btn btn-sm btn-primary" disabled={isCommentEmpty}>
          Post Comment
        </button>
      </div>
    </form>
  ) : (
    <span>
      <Link to="/login">Sign in</Link> or <Link to="/register">Sign up</Link> to
      add comments on this article.
    </span>
  );
}

export default CommentEditor;
