// components/post/PostForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { compressImage } from '../../utils/helpers';
import AIPostAssistant from '../ai/AIPostAssistant';
import Button from '../ui/Button';

const MAX_CHARS = 500;

export default function PostForm({
  defaultValues = { description: '', image: null, isPublic: true },
  onSaveDraft,
  onPublish,
  isSubmittingDraft = false,
  isSubmittingPublish = false,
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: defaultValues.description || '',
      isPublic: defaultValues.isPublic ? 'true' : 'false',
    },
  });

  const [imagePreview, setImagePreview] = useState(defaultValues.image || null);
  const [intendedAction, setIntendedAction] = useState('publish');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  const description = watch('description') || '';
  const charCount = description.length;

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    setIsProcessingImage(true);
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch (err) {
      setImageError('Could not process that image. Try a different file.');
    } finally {
      setIsProcessingImage(false);
    }
  }

  function handleRemoveImage() {
    setImagePreview(null);
  }

  function onSubmit(data) {
    const payload = {
      description: data.description.trim(),
      image: imagePreview,
      isPublic: data.isPublic === 'true',
    };
    if (intendedAction === 'draft') {
      onSaveDraft(payload);
    } else {
      onPublish(payload);
    }
  }

  const counterColor =
    charCount >= 480
      ? 'text-rose-500'
      : charCount >= 400
      ? 'text-amber-500'
      : 'text-mutedLight dark:text-muted';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl shadow-card p-6 space-y-5"
    >
      <AIPostAssistant
        onUseContent={(content) => setValue('description', content, { shouldValidate: true })}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-1.5">
          Description
        </label>
        <textarea
          rows={5}
          placeholder="What's on your mind?"
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-surface px-4 py-2.5 text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted resize-none',
            'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40',
            errors.description
              ? 'border-rose-500'
              : 'border-ink/10 dark:border-surface-border focus:border-brand-500 dark:focus:border-brand-400'
          )}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: MAX_CHARS, message: `Description can't exceed ${MAX_CHARS} characters` },
          })}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.description ? (
            <p className="text-xs text-rose-500">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <span className={clsx('text-xs font-mono', counterColor)}>
            {charCount} / {MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-1.5">
          Image
        </label>

        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-72 object-cover rounded-xl border border-ink/10 dark:border-surface-border"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ink/70 text-white grid place-items-center hover:bg-ink/90 transition-colors"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-ink/15 dark:border-surface-border rounded-xl py-8 cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 transition-colors">
            {isProcessingImage ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                <span className="text-sm text-mutedLight dark:text-muted">Processing image...</span>
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mutedLight dark:text-muted">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-sm text-mutedLight dark:text-muted">Click to upload an image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isProcessingImage} />
          </label>
        )}
        {imageError && <p className="mt-1.5 text-xs text-rose-500">{imageError}</p>}
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-1.5">
          Visibility
        </label>
        <div className="flex gap-2">
          <label className="flex-1">
            <input type="radio" value="true" className="peer sr-only" {...register('isPublic')} />
            <div className="text-center text-sm py-2.5 rounded-xl border border-ink/10 dark:border-surface-border cursor-pointer peer-checked:bg-brand-500/10 peer-checked:border-brand-500 peer-checked:text-brand-600 dark:peer-checked:text-brand-400 text-mutedLight dark:text-muted transition-colors">
              Public
            </div>
          </label>
          <label className="flex-1">
            <input type="radio" value="false" className="peer sr-only" {...register('isPublic')} />
            <div className="text-center text-sm py-2.5 rounded-xl border border-ink/10 dark:border-surface-border cursor-pointer peer-checked:bg-brand-500/10 peer-checked:border-brand-500 peer-checked:text-brand-600 dark:peer-checked:text-brand-400 text-mutedLight dark:text-muted transition-colors">
              Private
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="submit"
          variant="secondary"
          onClick={() => setIntendedAction('draft')}
          isLoading={isSubmittingDraft}
          disabled={charCount > MAX_CHARS || isProcessingImage}
        >
          Save as Draft
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={() => setIntendedAction('publish')}
          isLoading={isSubmittingPublish}
          disabled={charCount > MAX_CHARS || isProcessingImage}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}