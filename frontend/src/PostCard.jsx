import { useState } from "react";

function PostCard({ post, onLike, onComment, onDelete }) {
  const [comment, setComment] = useState("");

  const username = localStorage.getItem("username");
  const liked = post.likes.includes(username);
  const isOwner = post.username === username;

  const handleComment = () => {
    if (!comment.trim()) return;

    onComment(post._id, comment);
    setComment("");
  };

  return (
    <article className="post-card">
      <div className="post-user">
        <div className="avatar">
  {(post.username || "U").charAt(0).toUpperCase()}
</div>

        <div className="user-info">
          <strong>{post.username}</strong>
          <small>@{post.username}</small>
        </div>

        {isOwner && (
          <button
            className="delete-button"
            onClick={() => onDelete(post._id)}
            title="Delete post"
          >
            🗑️
          </button>
        )}
      </div>

      {post.text && <p>{post.text}</p>}

      {post.image && (
        <img
          className="post-image"
          src={post.image}
          alt="Post"
        />
      )}

      <div className="post-footer">
        <button
          className={liked ? "post-action liked" : "post-action"}
          onClick={() => onLike(post._id)}
        >
          {liked ? "♥" : "♡"} {post.likes.length}
        </button>

        <span className="post-action">
          💬 {post.comments.length}
        </span>
      </div>

      <div className="comment-box">
        <input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleComment();
            }
          }}
        />

        <button onClick={handleComment}>
          Comment
        </button>
      </div>

      {post.comments.length > 0 && (
        <div className="comments">
          {post.comments.map((item, index) => (
            <div className="comment" key={index}>
              <strong>{item.username}</strong>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default PostCard;