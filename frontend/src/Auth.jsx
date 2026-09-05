import { useState } from "react";

function Auth({ onLogin }) {
  const [login, setLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = login
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/signup";

    const body = login
      ? { email, password }
      : { username, email, password };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      if (login) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        onLogin();
      }

      alert(data.message);
    } else {
      alert(data.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">
          <span>✦</span>
        </div>

        <h1>Social</h1>

        <p className="auth-subtitle">
          {login
            ? "Welcome back! Login to continue."
            : "Create an account and join the community."}
        </p>

        <form onSubmit={handleSubmit}>
          {!login && (
            <div className="auth-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-submit" type="submit">
            {login ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-switch">
          {login ? "Don't have an account?" : "Already have an account?"}

          <button onClick={() => setLogin(!login)}>
            {login ? "Sign up" : "Login"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Auth;