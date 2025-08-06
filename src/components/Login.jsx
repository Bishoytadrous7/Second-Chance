import { useState, useEffect } from "react";
import { supabase } from "../client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setLoggedIn(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();
        setUsername(profile?.username || "");
      }
    }
    checkUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = "/";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="main-container">
      {loggedIn ? (
        <div>
          <span>Logged in as: {username || email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={email} 
          onChange={e => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required/>
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Login;