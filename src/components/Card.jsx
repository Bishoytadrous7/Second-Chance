import { useEffect, useState } from 'react';
import './Card.css';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import more from './more.png';

const Card = (props) => {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(props.upvotes);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data?.user?.id || null);
    });
  }, []);

  const isAuthor = currentUserId === props.user_id;

  const handleToggleUpvote = async () => {
    const newCount = hasUpvoted ? upvoteCount - 1 : upvoteCount + 1;
    const { error } = await supabase
      .from('used1')
      .update({ upvotes: newCount })
      .eq('id', props.id);
    if (!error) {
      setUpvoteCount(newCount);
      setHasUpvoted(!hasUpvoted);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('used1')
      .delete()
      .eq('id', props.id);
    if (!error) {
      window.location.reload();
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `Posted ${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Posted ${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Posted ${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `Posted ${days} days ago`;
  };

  return (
    <div className="Card">
      <div className="card-meta">
        <span>{timeAgo(props.created_at)}</span>
        <img
          src={more}
          alt="more options"
          className="more-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        {menuOpen && isAuthor && (
          <div className="menu-popup">
            <Link to={`/edit/${props.id}`}>Edit</Link>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      <h2>{props.title}</h2>
      <p>{upvoteCount} Likes</p>
      <button className="details-btn" onClick={handleToggleUpvote} disabled={!currentUserId}>
        {hasUpvoted ? "Unlike" : "Like"}
      </button>
      <Link to={`/post/${props.id}`} className="details-btn">More Details</Link>
    </div>
  );
};

export default Card;