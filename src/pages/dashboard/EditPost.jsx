// pages/dashboard/EditPost.jsx
import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import PostForm from '../../components/post/PostForm';

export default function EditPost() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { posts, updatePost } = usePosts();
  const navigate = useNavigate();

  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const post = posts.find((p) => p.id === postId);

  // Post doesn't exist, or belongs to someone else — bounce back to My Posts
  if (!post || post.authorId !== currentUser.id) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  function handleSaveDraft(data) {
    setIsSubmittingDraft(true);
    setErrorMessage('');
    try {
      updatePost(post.id, {
        description: data.description,
        image: data.image,
        isPublic: data.isPublic,
        isDraft: true,
      });
      setDraftMessage('Post saved as draft');
      setTimeout(() => setDraftMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmittingDraft(false);
    }
  }

  function handlePublish(data) {
    setIsSubmittingPublish(true);
    setErrorMessage('');
    try {
      updatePost(post.id, {
        description: data.description,
        image: data.image,
        isPublic: data.isPublic,
        isDraft: false,
      });
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmittingPublish(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-6">
        Edit Post
      </h1>

      {draftMessage && (
        <div className="mb-4 text-sm text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-lg px-3 py-2 animate-fadeUp">
          {draftMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 animate-fadeUp">
          {errorMessage}
        </div>
      )}

      <PostForm
        defaultValues={{
          description: post.description,
          image: post.image,
          isPublic: post.isPublic,
        }}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSubmittingDraft={isSubmittingDraft}
        isSubmittingPublish={isSubmittingPublish}
      />
    </div>
  );
}