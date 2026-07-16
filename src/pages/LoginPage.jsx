// pages/LoginPage.jsx
import { useState } from 'react';
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Already logged in? Don't show the login form at all.
  if (isAuthenticated) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  async function onSubmit(data) {
    setServerError('');
    setIsSubmitting(true);
    try {
      login(data.email, data.password);
      const redirectTo = location.state?.from?.pathname || '/dashboard/posts';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[85vh] grid place-items-center px-4">
      <div className="w-full max-w-sm animate-fadeUp">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper">
            Welcome back
          </h1>
          <p className="text-sm text-mutedLight dark:text-muted mt-1.5">
            Log in to keep up with your feed
          </p>
        </div>

        {location.state?.message && (
          <div className="mb-4 text-sm text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-lg px-3 py-2 text-center animate-fadeUp">
            {location.state.message}
          </div>
        )}

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
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-mutedLight dark:text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}