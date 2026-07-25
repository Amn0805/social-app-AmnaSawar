// components/ai/AIProfileOptimize.jsx
import { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import Button from '../ui/Button';

export default function AIProfileOptimize({ name, bio, location, onUseSuggestion }) {
  const { optimizeBio } = useAI();
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setIsLoading(true);
    setError('');
    setSuggestion('');
    try {
      const improved = await optimizeBio({ bio, name, location });
      setSuggestion(improved);
    } catch (err) {
      setError('Could not optimize your bio right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleUse() {
    onUseSuggestion(suggestion);
    setSuggestion('');
  }

  return (
    <div className="mt-2">
      <Button type="button" variant="secondary" size="sm" onClick={handleClick} isLoading={isLoading}>
        ✨ Optimise with AI
      </Button>

      {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}

      {suggestion && (
        <div className="mt-3 bg-white dark:bg-surface border border-ink/10 dark:border-surface-border rounded-xl p-3 animate-fadeUp">
          <p className="text-xs text-mutedLight dark:text-muted mb-1">Suggested bio:</p>
          <p className="text-sm text-ink dark:text-paper mb-3">{suggestion}</p>
          <Button type="button" size="sm" onClick={handleUse}>
            Use Suggestion
          </Button>
        </div>
      )}
    </div>
  );
}