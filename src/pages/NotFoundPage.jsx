// pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center animate-fadeUp">
        <p className="font-display text-6xl font-semibold text-brand-500 mb-2">404</p>
        <h1 className="font-display text-xl font-semibold text-ink dark:text-paper mb-2">
          Page not found
        </h1>
        <p className="text-sm text-mutedLight dark:text-muted mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/">
          <Button>Back to Feed</Button>
        </Link>
      </div>
    </div>
  );
}