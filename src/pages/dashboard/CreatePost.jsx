// pages/dashboard/CreatePost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import PostForm from '../../components/post/PostForm';

export default function CreatePost() {
  const { currentUser } = useAuth();  //current user info id,name , email 
  const { createPost } = usePosts();    
  const navigate = useNavigate();

  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);      //loading states 
  const [draftMessage, setDraftMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formKey, setFormKey] = useState(0); // bump to force PostForm to remount + clear

  function handleSaveDraft(data) {
    setIsSubmittingDraft(true);
    setErrorMessage('');
    try {
      createPost({
        authorId: currentUser.id,
        description: data.description,
        image: data.image,
        isPublic: data.isPublic,
        isDraft: true,
      });
      setDraftMessage('Post saved as draft');
      setFormKey((k) => k + 1); // clears the form
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
      createPost({
        authorId: currentUser.id,
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
        Create Post
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
        key={formKey}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSubmittingDraft={isSubmittingDraft}
        isSubmittingPublish={isSubmittingPublish}
      />
    </div>
  );
}