import { useState, useEffect } from 'react';
import { supabase } from '../client';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUserId(data.user?.id);
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Title is required!");
      return;
    }
    if (!userId) {
      alert("You must be logged in to create a post.");
      return;
    }

    const { error } = await supabase.from('used1').insert([{
      title,
      content,
      image_url: imageUrl,
      flag: category,
      video_url: videoUrl,
      upvotes: 0,
      comments: [],
      user_id: userId
    }]);

    if (error) {
      alert("Failed to create post: " + error.message);
    } else {
      window.location = '/';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>

      <label>Title (required):</label><br />
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
      /><br /><br />

      <label>Content (optional):</label><br />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows="4"
        cols="40"
      /><br /><br />

      <label>Image URL (optional):</label><br />
      <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
       /><br /><br />

      <label>Category:</label>
      <select value={category} onChange={e => setCategory(e.target.value)} name="flag">
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Other">Other</option>
      </select>
      <br /><br />

      <label>Video URL (optional):</label>
      <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
       /><br /><br />

      <input type="submit" value="Create Post" />
    </form>
  );
};

export default CreatePost;