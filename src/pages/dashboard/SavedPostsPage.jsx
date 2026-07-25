// pages/dashboard/SavedPostsPage.jsx
import { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../../components/post/PostCard';

export default function SavedPostsPage() {
  const { currentUser } = useAuth();
  const { posts } = usePosts();

  const savedPosts = useMemo(() => {
    const savedIds = currentUser.savedPostIds || [];
    return posts
      .filter((p) => savedIds.includes(p.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, currentUser.savedPostIds]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-6">
        Saved Posts
      </h1>

      {savedPosts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl animate-fadeUp">
          <p className="text-mutedLight dark:text-muted">
            No saved posts yet — tap the bookmark icon on any post to save it here.
          </p>
        </div>
      ) : (
        <div className="max-w-xl space-y-5">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}