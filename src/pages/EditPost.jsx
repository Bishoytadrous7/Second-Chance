import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('used1')
        .select()
        .eq('id', id)
        .single();
      if (!error && data) {
        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.image_url);
        setCategory(data.flag || '');
        setVideoUrl(data.video_url || '');
      }
    }
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('used1')
      .update({
        title,
        content,
        image_url: imageUrl,
        flag: category,
        video_url: videoUrl,
      })
      .eq('id', id);
    if (!error) {
      alert('Post updated!');
      navigate('/');
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('used1')
      .delete()
      .eq('id', id);
    if (!error) {
      alert('Post deleted.');
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Edit Post</h2>

      <label>Title:</label><br />
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
      /><br /><br />

      <label>Content:</label><br />
      <textarea
        rows="4"
        value={content}
        onChange={e => setContent(e.target.value)}
      /><br /><br />

      <label>Image URL:</label><br />
      <input type="text" value={imageUrl}onChange={e => setImageUrl(e.target.value)}
      /><br /><br />

      <label>Category:</label><br />
      <select name="flag" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Other">Other</option>
      </select>
      <br /><br />

      <label>Video URL:</label><br />
      <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
      /><br /><br />

      <input type="submit" value="Update Post" />
      <button type="button" onClick={handleDelete} className="delete-btn">
        Delete Post
      </button>
    </form>
  );
};

export default EditPost;