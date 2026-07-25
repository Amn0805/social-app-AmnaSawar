// components/chat/MessageInput.jsx
import { useState, useRef, useEffect } from 'react';
import MediaPreview from './MediaPreview';

export default function MessageInput({ text, onTextChange, onSend, disabled = false }) {
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const maxHeight = 4 * 24;
      el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
    }
  }, [text]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({ type: isVideo ? 'video' : 'image', dataUrl: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleSend() {
    const trimmed = (text || '').trim();
    if (!trimmed && !attachedFile) return;

    if (attachedFile) {
      onSend({ type: attachedFile.type, content: attachedFile.dataUrl });
      setAttachedFile(null);
    }
    if (trimmed) {
      onSend({ type: 'text', content: trimmed });
    }
    onTextChange('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  const canSend = ((text || '').trim().length > 0 || attachedFile) && !disabled;

  return (
    <div className="border-t border-ink/5 dark:border-surface-border p-3">
      <MediaPreview file={attachedFile} onRemove={() => setAttachedFile(null)} />

      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
          disabled={disabled}
          className="w-9 h-9 shrink-0 grid place-items-center rounded-full text-mutedLight dark:text-muted hover:bg-ink/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 resize-none rounded-xl border border-ink/10 dark:border-surface-border bg-white dark:bg-surface px-4 py-2 text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 dark:focus:border-brand-400 transition-colors max-h-24 overflow-y-auto disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}