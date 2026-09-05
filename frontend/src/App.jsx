import { useEffect, useState } from "react";
import Auth from "./Auth";
import PostCard from "./PostCard";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (loggedIn) {
      fetch("http://localhost:5000/api/posts")
        .then((res) => res.json())
        .then((data) => setPosts(data));
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return <Auth onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Social</h1>
       <div className="header-user">
  <span>👤</span>
  <span>{localStorage.getItem("username")}</span>
</div>
        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            setLoggedIn(false);
          }}
        >
          Logout
        </button>
      </header>

      <div className="search">
        🔍
        <input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="create-post">
        <h2>Create Post</h2>

        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {image && (
          <img
            src={image}
            alt="Selected"
            className="image-preview"
          />
        )}

        <div className="post-actions">
          <label>
            📷

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const maxWidth = 1200;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setImage(canvas.toDataURL("image/jpeg", 0.8));
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
}
              }}
            />
          </label>

          <button
            onClick={async () => {
              if (!text && !image) {
                alert("Write something or select an image");
                return;
              }

              const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    text,
                    image
                  })
                }
              );

              const data = await response.json();

              if (response.ok) {
                setPosts([data, ...posts]);
                setText("");
                setImage("");
                alert("Post created");
              } else {
                alert(data.message);
              }
            }}
          >
            Post
          </button>
        </div>
      </section>

      {posts
        .filter((post) =>
          `${post.username} ${post.text || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((post) => (
          <PostCard
            key={post._id}
            post={post}

            onLike={async (id) => {
              const response = await fetch(
                `http://localhost:5000/api/posts/${id}/like`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({})
                }
              );

              const updatedPost = await response.json();

              if (response.ok) {
                setPosts((currentPosts) =>
                  currentPosts.map((item) =>
                    item._id === updatedPost._id
                      ? updatedPost
                      : item
                  )
                );
              } else {
                alert(updatedPost.message);
              }
            }}

            onComment={async (id, text) => {
              const response = await fetch(
                `http://localhost:5000/api/posts/${id}/comment`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    text
                  })
                }
              );

              const updatedPost = await response.json();

              if (response.ok) {
                setPosts((currentPosts) =>
                  currentPosts.map((item) =>
                    item._id === updatedPost._id
                      ? updatedPost
                      : item
                  )
                );
              } else {
                alert(updatedPost.message);
              }
            }}

            onDelete={async (id) => {
              const response = await fetch(
                `http://localhost:5000/api/posts/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              const data = await response.json();

              if (response.ok) {
                setPosts((currentPosts) =>
                  currentPosts.filter((post) => post._id !== id)
                );
              } else {
                alert(data.message);
              }
            }}
          />
        ))}
    </main>
  );
}

export default App;