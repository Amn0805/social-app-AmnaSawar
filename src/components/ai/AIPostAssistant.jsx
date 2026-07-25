// components/ai/AIPostAssistant.jsx
import { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import Button from '../ui/Button';

export default function AIPostAssistant({ onUseContent }) {
  const { generatePostContent } = useAI();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError('');
    setSuggestion('');
    try {
      const result = await generatePostContent(prompt.trim());
      setSuggestion(result);
    } catch (err) {
      setError('Could not generate content right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleUse() {
    onUseContent(suggestion);
    setSuggestion('');
    setPrompt('');
    setIsOpen(false);
  }

  return (
    <div className="border border-brand-500/20 rounded-xl overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-500/5 hover:bg-brand-500/10 transition-colors text-sm font-medium text-brand-700 dark:text-brand-400"
      >
        <span>✨ AI Writing Assistant</span>
        <span className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'}>⌄</span>
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 animate-fadeUp">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I just completed a React project"
            className="w-full rounded-xl border border-ink/10 dark:border-surface-border bg-white dark:bg-surface px-4 py-2 text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
          />

          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={!prompt.trim() || isLoading}
          >
            Generate Post Content
          </Button>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          {suggestion && (
            <div className="bg-white dark:bg-surface border border-ink/10 dark:border-surface-border rounded-xl p-3 animate-fadeUp">
              <p className="text-sm text-ink dark:text-paper whitespace-pre-wrap mb-3">
                {suggestion}
              </p>
              <Button type="button" size="sm" variant="secondary" onClick={handleUse}>
                Use This Content
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}