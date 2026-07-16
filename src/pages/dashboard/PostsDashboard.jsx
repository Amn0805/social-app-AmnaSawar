// pages/dashboard/PostsDashboard.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

function statusVariant(post) {
  if (post.isDraft) return 'draft';
  return post.isPublic ? 'public' : 'private';
}

export default function PostsDashboard() {
  const { currentUser } = useAuth();
  const { posts, updatePost, deletePost, getLikeCount, getCommentCount } = usePosts();
  const [deleteTarget, setDeleteTarget] = useState(null); // post pending deletion

  const myPosts = useMemo(() => {
    return posts
      .filter((p) => p.authorId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, currentUser.id]);

  function handleTogglePrivacy(post) {
    updatePost(post.id, { isPublic: !post.isPublic });
  }

  function handlePublish(post) {
    updatePost(post.id, { isDraft: false, isPublic: true });
  }

  function confirmDelete() {
    deletePost(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper">
          My Posts
        </h1>
        <Link to="/dashboard/create">
          <Button size="sm">+ New Post</Button>
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl animate-fadeUp">
          <p className="text-mutedLight dark:text-muted mb-4">
            You haven't created any posts yet. Create your first post!
          </p>
          <Link to="/dashboard/create">
            <Button size="sm">Create Post</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-fadeUp"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={statusVariant(post)} />
                  <span className="text-xs text-mutedLight dark:text-muted font-mono">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-ink dark:text-paper line-clamp-2">
                  {post.description || <span className="italic text-mutedLight dark:text-muted">No description</span>}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-mutedLight dark:text-muted">
                  <span>{getLikeCount(post.id)} likes</span>
                  <span>{getCommentCount(post.id)} comments</span>
                </div>
              </div>

             <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                {post.isDraft && (
                  <Button size="sm" variant="primary" onClick={() => handlePublish(post)}>
                    Publish
                  </Button>
                )}
                <Button size="sm" variant="secondary" onClick={() => handleTogglePrivacy(post)}>
                  {post.isPublic ? 'Make Private' : 'Make Public'}
                </Button>
                <Link to={`/dashboard/edit/${post.id}`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(post)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this post?"
      >
        <p className="text-sm text-mutedLight dark:text-muted mb-5">
          This will permanently remove the post along with its comments and likes. This can't be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}