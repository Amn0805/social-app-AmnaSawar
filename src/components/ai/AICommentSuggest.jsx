// components/ai/AICommentSuggest.jsx
import { useState } from 'react';
import { useAI } from '../../hooks/useAI';

export default function AICommentSuggest({ postDescription, onSuggest }) {
  const { suggestComment } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setIsLoading(true);
    setError('');
    try {
      const comment = await suggestComment(postDescription || '');
      onSuggest(comment);
    } catch (err) {
      setError('Could not suggest a comment right now.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-60 flex items-center gap-1"
      >
        {isLoading ? (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-brand-500 border-t-transparent animate-spin inline-block" />
            Thinking...
          </>
        ) : (
          '✨ Suggest Comment'
        )}
      </button>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}