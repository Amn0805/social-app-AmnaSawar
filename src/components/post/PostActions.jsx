// components/post/PostActions.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';

export default function PostActions({ postId, showComment = true, size = 'md' }) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { toggleLike, isLikedBy, getLikeCount, getCommentCount } = usePosts();

  const [liked, setLiked] = useState(isLikedBy(postId, currentUser?.id));
  const [likeCount, setLikeCount] = useState(getLikeCount(postId));
  const [burst, setBurst] = useState(false);
  const commentCount = getCommentCount(postId);
  const iconSize = size === 'lg' ? 20 : 18;

  function handleLikeClick(e) {
    e?.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    toggleLike(postId, currentUser.id);
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    if (!liked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 400);
    }
  }

  function handleCommentClick(e) {
    e?.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    navigate(`/posts/${postId}`);
  }

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={handleLikeClick}
        aria-label={liked ? 'Unlike' : 'Like'}
        className={clsx(
          'flex items-center gap-1.5 text-sm transition-colors',
          liked ? 'text-rose-500' : 'text-mutedLight dark:text-muted hover:text-rose-500'
        )}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          className={clsx(burst && 'animate-heartBurst')}
        >
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
        </svg>
        {likeCount} {size === 'lg' && (likeCount === 1 ? 'Like' : 'Likes')}
      </button>

      {showComment && (
        <button
          onClick={handleCommentClick}
          className="flex items-center gap-1.5 text-sm text-mutedLight dark:text-muted hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
          {commentCount}
        </button>
      )}
    </div>
  );
}