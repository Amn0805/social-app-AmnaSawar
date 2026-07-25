// pages/dashboard/ProfileSettings.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { compressImage } from '../../utils/helpers';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AIProfileOptimize from '../../components/ai/AIProfileOptimize';

const BIO_MAX = 150;

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const bio = watch('bio') || '';
  const bioCount = bio.length;
  const watchedName = watch('name') || currentUser.name;
  const watchedLocation = watch('location') || '';

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingImage(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 400 });
      setAvatarPreview(compressed);
    } catch (err) {
      setErrorMessage('Could not process that image. Try a different file.');
    } finally {
      setIsProcessingImage(false);
    }
  }

  function onSubmit(data) {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      updateCurrentUser({
        name: data.name,
        bio: data.bio,
        location: data.location,
        avatar: avatarPreview,
      });
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-6">
        Profile Settings
      </h1>

      {successMessage && (
        <div className="mb-4 text-sm text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-lg px-3 py-2 animate-fadeUp">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 animate-fadeUp">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl shadow-card p-6 space-y-5"
      >
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-2">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
            <label>
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-surface border border-ink/10 dark:border-surface-border text-ink dark:text-paper hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors">
                {isProcessingImage ? 'Processing...' : 'Change photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isProcessingImage}
              />
            </label>
          </div>
        </div>

        <Input
          label="Full name"
          error={errors.name?.message}
          {...register('name', { required: 'Full name is required' })}
        />

        <div>
          <label className="block text-sm font-medium text-ink/80 dark:text-paper/80 mb-1.5">
            Bio
          </label>
          <textarea
            rows={3}
            placeholder="Tell people a bit about yourself"
            className={clsx(
              'w-full rounded-xl border bg-white dark:bg-surface px-4 py-2.5 text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted resize-none',
              'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40',
              errors.bio
                ? 'border-rose-500'
                : 'border-ink/10 dark:border-surface-border focus:border-brand-500 dark:focus:border-brand-400'
            )}
            {...register('bio', {
              maxLength: { value: BIO_MAX, message: `Bio can't exceed ${BIO_MAX} characters` },
            })}
          />
          <div className="flex items-center justify-between mt-1.5">
            {errors.bio ? (
              <p className="text-xs text-rose-500">{errors.bio.message}</p>
            ) : (
              <span />
            )}
            <span
              className={clsx(
                'text-xs font-mono',
                bioCount >= BIO_MAX ? 'text-rose-500' : 'text-mutedLight dark:text-muted'
              )}
            >
              {bioCount} / {BIO_MAX}
            </span>
          </div>

          <AIProfileOptimize
            name={watchedName}
            bio={bio}
            location={watchedLocation}
            onUseSuggestion={(suggestion) =>
              setValue('bio', suggestion, { shouldValidate: true })
            }
          />
        </div>

        <Input label="Location" placeholder="e.g. Lahore, Pakistan" {...register('location')} />

        <div className="flex justify-end pt-1">
          <Button type="submit" isLoading={isSubmitting} disabled={isProcessingImage}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}