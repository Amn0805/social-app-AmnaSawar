// components/post/PostCard.jsx
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import Avatar from '../ui/Avatar';
import PostActions from './PostActions';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const author = storage.getUsers().find((u) => u.id === post.authorId);

  function handleCardClick() {
    navigate(`/posts/${post.id}`);
  }

  function handleAuthorClick(e) {
    e.stopPropagation();
    navigate(`/profile/${post.authorId}`);
  }

  if (!author) return null;

  return (
    <article
      onClick={handleCardClick}
      className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 cursor-pointer overflow-hidden animate-fadeUp"
    >
      <div className="p-4 flex items-center gap-3">
        <button onClick={handleAuthorClick} className="shrink-0">
          <Avatar src={author.avatar} name={author.name} size="md" />
        </button>
        <div className="min-w-0">
          <button
            onClick={handleAuthorClick}
            className="font-display font-semibold text-sm text-ink dark:text-paper hover:text-brand-600 dark:hover:text-brand-400 truncate block"
          >
            {author.name}
          </button>
          <p className="text-xs text-mutedLight dark:text-muted font-mono">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {post.description && (
        <p className="px-4 pb-3 text-sm text-ink/90 dark:text-paper/90 whitespace-pre-wrap line-clamp-4">
          {post.description}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full max-h-[420px] object-cover border-y border-ink/5 dark:border-surface-border"
        />
      )}

      <div className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <PostActions postId={post.id} />
      </div>
    </article>
  );
}