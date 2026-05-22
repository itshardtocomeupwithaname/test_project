import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dateFormatter from "../../helpers/dateFormatter";
import deleteComment from "../../services/deleteComment";
import getComments from "../../services/getComments";
import toggleLike from "../../services/toggleLike";
import CommentAuthor from "./CommentAuthor";

function CommentList({ triggerUpdate, updateComments }) {
  const [comments, setComments] = useState([]);
  const { headers, isAuth, loggedUser } = useAuth();
  const { slug } = useParams();

  useEffect(() => {
    getComments({ slug }).then(setComments).catch(console.error);
  }, [slug, triggerUpdate]);

  const handleDelete = (commentId) => {
    if (!isAuth) alert("You need to login first");

    const confirmation = window.confirm("Want to delete the comment?");
    if (!confirmation) return;

    deleteComment({ commentId, headers, slug })
      .then(updateComments)
      .catch(console.error);
  };

  const handleLike = async (commentId, liked) => {
    if (!isAuth) {
      alert("You need to login first");
      return;
    }

    const comment = await toggleLike({ slug, commentId, liked, headers });
    if (comment) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? comment : c)),
      );
    }
  };

  return comments?.length > 0 ? (
    comments.map(
      ({ author, author: { username }, body, createdAt, id, liked, likeCount }) => {
        return (
          <div className="card" key={id}>
            <div className="card-block">
              <p className="card-text">{body}</p>
            </div>
            <div className="card-footer">
              <CommentAuthor {...author} />
              <span className="date-posted">{dateFormatter(createdAt)}</span>
              <button
                className={`btn btn-sm ${liked ? "btn-primary" : "btn-outline-primary"} pull-xs-right`}
                onClick={() => handleLike(id, liked)}
              >
                <i className="ion-heart"></i> {likeCount ?? 0}
              </button>
              {isAuth && loggedUser.username === username && (
                <button
                  className="btn btn-sm btn-outline-secondary pull-xs-right"
                  onClick={() => handleDelete(id)}
                >
                  <i className="ion-trash-a"></i>
                </button>
              )}
            </div>
          </div>
        );
      },
    )
  ) : (
    <div>There are no comments yet...</div>
  );
}

export default CommentList;
