// pages/ProfilePage.jsx
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';

export default function ProfilePage() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { posts } = usePosts();

  const user = storage.getUsers().find((u) => u.id === userId);
  const isOwner = currentUser?.id === userId;

  const publicPosts = useMemo(() => {
    return posts
      .filter((p) => p.authorId === userId && p.isPublic && !p.isDraft)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, userId]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-fadeUp">
        <p className="text-mutedLight dark:text-muted mb-4">This user doesn't exist.</p>
        <Link to="/" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <ProfileHeader user={user} isOwner={isOwner} />

      <div className="mt-6 space-y-5">
        {publicPosts.length === 0 ? (
          <div className="text-center py-16 animate-fadeUp">
            <p className="text-mutedLight dark:text-muted">No public posts yet</p>
          </div>
        ) : (
          publicPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}