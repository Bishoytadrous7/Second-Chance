import { useState } from 'react';
import { supabase } from '../client';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      return;
    }

    const userId = data.user?.id;

    if (userId && username) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, username }]);
      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    window.location.href = '/';
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" value={username}
      onChange={e => setUsername(e.target.value)} required/>
      <input type="email" placeholder="Email"value={email}
      onChange={e => setEmail(e.target.value)} required/>
      <input type="password" placeholder="Password" value={password}
      onChange={e => setPassword(e.target.value)} required/>
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Signup;