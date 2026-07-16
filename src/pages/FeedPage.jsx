// pages/FeedPage.jsx
import { useMemo, useState, useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/post/PostCard';

function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full animate-shimmer" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-28 rounded animate-shimmer" />
          <div className="skeleton h-2.5 w-16 rounded animate-shimmer" />
        </div>
      </div>
      <div className="skeleton h-48 w-full animate-shimmer" />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export default function FeedPage() {
  const { posts } = usePosts();
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  // Tiny artificial delay so the skeleton is actually visible — remove
  // freely, purely a polish touch for perceived performance.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const feedPosts = useMemo(() => {
    return posts
      .filter((p) => p.isPublic && !p.isDraft)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts]);

  // Bonus: live search by description, no submit button — filters on every keystroke
  const visiblePosts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return feedPosts;
    return feedPosts.filter((p) => p.description?.toLowerCase().includes(trimmed));
  }, [feedPosts, query]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-4">
        Feed
      </h1>

      <div className="relative mb-6">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedLight dark:text-muted">
          <SearchIcon />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-xl border border-ink/10 dark:border-surface-border bg-white dark:bg-surface pl-10 pr-4 py-2.5 text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="space-y-5">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : feedPosts.length === 0 ? (
        <div className="text-center py-20 animate-fadeUp">
          <p className="text-mutedLight dark:text-muted">
            No posts yet — be the first to share!
          </p>
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="text-center py-20 animate-fadeUp">
          <p className="text-mutedLight dark:text-muted">
            No results found for "{query}"
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}