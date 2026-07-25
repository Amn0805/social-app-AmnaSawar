// components/post/BookmarkButton.jsx
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

export default function BookmarkButton({ postId, size = 'md' }) {
  const navigate = useNavigate();
  const { isAuthenticated, isPostSaved, toggleSavedPost } = useAuth();
  const saved = isAuthenticated && isPostSaved(postId);
  const iconSize = size === 'lg' ? 20 : 18;

  function handleClick(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to save posts' } });
      return;
    }
    toggleSavedPost(postId);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved posts' : 'Save post'}
      title={saved ? 'Saved' : 'Save post'}
      className={clsx(
        'transition-colors',
        saved ? 'text-brand-500' : 'text-mutedLight dark:text-muted hover:text-brand-500'
      )}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    </button>
  );
}