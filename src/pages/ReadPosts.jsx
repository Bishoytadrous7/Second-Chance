import { useEffect, useState } from 'react';
import { supabase } from '../client';
import './ReadPosts.css';
import Card from '../components/Card';

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [flagFilter, setFlagFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let query = supabase.from('used1').select('*');

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'popular') {
        query = query.order('upvotes', { ascending: false });
      }

      const { data, error } = await query;
      setLoading(false);

      if (!error) {
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', error.message);
      }
    };

    fetchPosts();
  }, [sortBy]);

const filteredPosts = posts.filter(post =>
  (!flagFilter || post.flag === flagFilter) &&
  post.title.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div className="post-page-container">
      <div className="filter-bar">
        <span>Order by:</span>
        <button
          className={`filter-btn ${sortBy === 'newest' ? 'active' : ''}`}
          onClick={() => setSortBy('newest')}
        >Newest</button>
        <button className={`filter-btn ${sortBy === 'popular' ? 'active' : ''}`}
        onClick={() => setSortBy('popular')}>Most Popular</button>

       <select name="flag" value={flagFilter} onChange={e => setFlagFilter(e.target.value)}>
      <option value="">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Furniture">Furniture</option>
      <option value="Clothing">Clothing</option>
      <option value="Books">Books</option>
      <option value="Vehicles">Vehicles</option>
      <option value="Other">Other</option>
    </select>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            image_url={post.image_url}
            upvotes={post.upvotes}
            comments={post.comments}
            created_at={post.created_at}
            user_id={post.user_id}  
          />
        ))
  )}
    </div>
  );
};

export default ReadPosts;