// pages/PostDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { usePosts } from '../hooks/usePosts';
import Avatar from '../components/ui/Avatar';
import PostActions from '../components/post/PostActions';
import CommentSection from '../components/post/CommentSection';

export default function PostDetailPage() {
  const { postId } = useParams();
  const { posts } = usePosts();

  const post = posts.find((p) => p.id === postId);
  const author = post ? storage.getUsers().find((u) => u.id === post.authorId) : null;

  if (!post || !author) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fadeUp">
        <p className="text-mutedLight dark:text-muted mb-4">This post doesn't exist.</p>
        <Link to="/" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <article className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl shadow-card overflow-hidden animate-fadeUp">
        <div className="p-5 flex items-center gap-3">
          <Link to={`/profile/${author.id}`} className="shrink-0">
            <Avatar src={author.avatar} name={author.name} size="md" />
          </Link>
          <div className="min-w-0">
            <Link
              to={`/profile/${author.id}`}
              className="font-display font-semibold text-ink dark:text-paper hover:text-brand-600 dark:hover:text-brand-400"
            >
              {author.name}
            </Link>
            <p className="text-xs text-mutedLight dark:text-muted font-mono">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {post.description && (
          <p className="px-5 pb-4 text-[15px] leading-relaxed text-ink/90 dark:text-paper/90 whitespace-pre-wrap">
            {post.description}
          </p>
        )}

        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full max-h-[560px] object-cover border-y border-ink/5 dark:border-surface-border"
          />
        )}

        <div className="px-5 py-4">
          <PostActions postId={post.id} showComment={false} size="lg" />
        </div>
      </article>

      <CommentSection postId={post.id} />
    </div>
  );
}