// pages/SignupPage.jsx
import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  if (isAuthenticated) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  async function onSubmit(data) {
    setServerError('');
    setIsSubmitting(true);
    try {
      signup({ name: data.name, email: data.email, password: data.password });
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[85vh] grid place-items-center px-4 py-10">
      <div className="w-full max-w-sm animate-fadeUp">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper">
            Create your account
          </h1>
          <p className="text-sm text-mutedLight dark:text-muted mt-1.5">
            Join and start sharing
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl shadow-card p-6 space-y-4"
        >
          {serverError && (
            <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 animate-fadeUp">
              {serverError}
            </div>
          )}

          <Input
            label="Full name"
            placeholder="Amna Khan"
            error={errors.name?.message}
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Include at least one uppercase letter and one number',
              },
            })}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign up
          </Button>
        </form>

        <p className="text-center text-sm text-mutedLight dark:text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}