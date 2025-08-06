import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { data: postData, error: postError } = await supabase
        .from('used1')
        .select()
        .eq('id', id)
        .single();
      if (!postError && postData) {
        setPost(postData);
        setUpvoteCount(postData.upvotes || 0);
        setCommentList(postData.comments || []);
      }

      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const userId = userData.user.id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();
        if (profile?.username) setUsername(profile.username);
      }
    }
    fetchData();
  }, [id]);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const handleToggleUpvote = async () => {
    const newCount = hasUpvoted ? upvoteCount - 1 : upvoteCount + 1;
    const { error } = await supabase
      .from('used1')
      .update({ upvotes: newCount })
      .eq('id', id);
    if (!error) {
      setUpvoteCount(newCount);
      setHasUpvoted(!hasUpvoted);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    if (!username) return alert("You must be logged in to comment");
    const updatedComments = [...(post.comments || []), `${username}: ${commentInput}`];
    const { error } = await supabase
      .from('used1')
      .update({ comments: updatedComments })
      .eq('id', id);
    if (!error) {
      setCommentList(updatedComments);
      setCommentInput('');
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="PostDetail">
      <h2>{post.title}</h2>
      <p className="meta">Posted {timeAgo(post.created_at)}</p>
      {username && <p>Logged in as: {username}</p>}
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="detail-img" />
      )}
      {post.video_url && (
        post.video_url.includes("youtube.com") || post.video_url.includes("youtu.be") ? (
          <div>
            <p>
              <a href={post.video_url} target="_blank" rel="noopener noreferrer">
                Follow the link to watch
              </a>
            </p>
          </div>
        ) : (
          <iframe
            width="100%"
            height="250"
            src={post.video_url}
            title="Web Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )
      )}
      <p className="content">{post.content}</p>
      <div className="comments-section">
        <h4>💬 Comments</h4>
        <ul>
          {commentList.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <input
          type="text"
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
          disabled={!username}
        />
        <p className="gray">{upvoteCount} Likes</p>
        <div className="actions-row">
          <button onClick={handleToggleUpvote} disabled={!username}>
            {hasUpvoted ? 'UnLike' : 'Like'}
          </button>
          <button onClick={handleAddComment} disabled={!username}>Comment</button>
        </div>
        {!username && <p style={{ color: "red" }}>Log in to comment or like.</p>}
      </div>
    </div>
  );
};

export default PostDetail;